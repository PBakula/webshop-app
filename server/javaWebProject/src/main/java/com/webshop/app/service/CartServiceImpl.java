package com.webshop.app.service;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.webshop.app.dto.CartDTO;
import com.webshop.app.dto.CartItemDTO;
import com.webshop.app.dto.CheckoutRequestDTO;
import com.webshop.app.model.ApplicationUser;
import com.webshop.app.model.PaymentMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final OrderService orderService;
    private final ProductService productService;
    private final PaypalService payPalService;

    public BigDecimal getTotalAmount(List<CartItemDTO> cartItems) {
        return cartItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public ResponseEntity<?> processCheckout(CheckoutRequestDTO checkoutRequest, ApplicationUser user) {
        if (checkoutRequest.getCartItems() == null || checkoutRequest.getCartItems().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cart is empty"));
        }

        List<CartItemDTO> cartItems = checkoutRequest.getCartItems();

        // Validate products and stock
        for (CartItemDTO item : cartItems) {
            var product = productService.getProductById(item.getProductId());
            if (product == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Product not found: " + item.getProductId()));
            }
            if (product.getStock() < item.getQuantity()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Insufficient stock for: " + product.getName()));
            }
        }

        BigDecimal totalPrice = getTotalAmount(cartItems);
        CartDTO cartDTO = new CartDTO(cartItems, totalPrice);

        // Process by payment method
        if (checkoutRequest.getPaymentMethod().equalsIgnoreCase("CASH")) {
            return processCashPayment(cartDTO, user, checkoutRequest);
        }
        else if (checkoutRequest.getPaymentMethod().equalsIgnoreCase("PAYPAL")) {
            return processPayPalPayment(cartDTO, user, checkoutRequest, totalPrice);
        }

        return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid payment method"));
    }

    private ResponseEntity<?> processCashPayment(CartDTO cartDTO, ApplicationUser user,
                                                 CheckoutRequestDTO checkoutRequest) {
        Long orderId = orderService.createPendingOrder(
                cartDTO,
                user,
                PaymentMethod.CASH_ON_DELIVERY,
                checkoutRequest.getShippingAddress()
        );
        orderService.confirmOrder(orderId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Order placed successfully",
                "orderId", orderId
        ));
    }

    private ResponseEntity<?> processPayPalPayment(CartDTO cartDTO, ApplicationUser user,
                                                   CheckoutRequestDTO checkoutRequest,
                                                   BigDecimal totalPrice) {
        try {
            Long orderId = orderService.createPendingOrder(
                    cartDTO,
                    user,
                    PaymentMethod.PAYPAL,
                    checkoutRequest.getShippingAddress()
            );

            String cancelUrl = "http://localhost:5173/payment/cancel?orderId=" + orderId;
            String successUrl = "http://localhost:5173/payment/success?orderId=" + orderId;

            Payment payment = payPalService.createPayment(
                    totalPrice.doubleValue(),
                    "EUR",
                    "paypal",
                    "sale",
                    "Order " + orderId,
                    cancelUrl,
                    successUrl
            );

            orderService.updateOrderPaymentId(orderId, payment.getId());

            String approvalUrl = payment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel()))
                    .findFirst()
                    .map(Links::getHref)
                    .orElseThrow(() -> new PayPalRESTException("No approval URL found"));

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "approvalUrl", approvalUrl,
                    "orderId", orderId
            ));
        } catch (PayPalRESTException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "PayPal payment error: " + e.getMessage()));
        }
    }


}
