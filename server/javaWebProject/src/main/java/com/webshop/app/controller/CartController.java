package com.webshop.app.controller;

import com.webshop.app.dto.CheckoutRequestDTO;
import com.webshop.app.exception.UserNotFoundException;
import com.webshop.app.model.ApplicationUser;
import com.webshop.app.repository.ApplicationUserRepository;
import com.webshop.app.service.CartService;
import com.webshop.app.service.OrderService;
import com.webshop.app.service.PaypalService;
import com.webshop.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CartController {

    private final CartService cartService;
    private final OrderService orderService;
    private final ApplicationUserRepository applicationUserRepository;
    private final PaypalService payPalService;
    private final ProductService productService;


//    @PostMapping("/checkout")
//    public ResponseEntity<?> checkout(@RequestBody CheckoutRequestDTO checkoutRequest,
//                                      Authentication authentication) {
//
//        if (authentication == null || !authentication.isAuthenticated()
//                || authentication instanceof AnonymousAuthenticationToken) {
//            return ResponseEntity.status(401)
//                    .body(Map.of("error", "User not authenticated"));
//        }
//
//
//        ApplicationUser user = applicationUserRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new IllegalStateException("User not found"));
//
//
//        if (checkoutRequest.getCartItems() == null || checkoutRequest.getCartItems().isEmpty()) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("error", "Cart is empty"));
//        }
//
//        List<CartItemDTO> cartItems = checkoutRequest.getCartItems();
//
//
//        for (CartItemDTO item : cartItems) {
//            var product = productService.getProductById(item.getProductId());
//            if (product == null) {
//                return ResponseEntity.badRequest()
//                        .body(Map.of("error", "Product not found: " + item.getProductId()));
//            }
//            if (product.getStock() < item.getQuantity()) {
//                return ResponseEntity.badRequest()
//                        .body(Map.of("error", "Insufficient stock for: " + product.getName()));
//            }
//        }
//
//        BigDecimal totalPrice = cartService.getTotalAmount(cartItems);
//        CartDTO cartDTO = new CartDTO(cartItems, totalPrice);
//
//        if (checkoutRequest.getPaymentMethod().equalsIgnoreCase("CASH")) {
//            Long orderId = orderService.createPendingOrder(
//                    cartDTO,
//                    user,
//                    PaymentMethod.CASH_ON_DELIVERY,
//                    checkoutRequest.getShippingAddress()
//            );
//            orderService.confirmOrder(orderId);
//
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "Order placed successfully",
//                    "orderId", orderId
//            ));
//        }
//        else if (checkoutRequest.getPaymentMethod().equalsIgnoreCase("PAYPAL")) {
//            try {
//                Long orderId = orderService.createPendingOrder(
//                        cartDTO,
//                        user,
//                        PaymentMethod.PAYPAL,
//                        checkoutRequest.getShippingAddress()
//                );
//
//                String cancelUrl = "http://localhost:5173/payment/cancel?orderId=" + orderId;
//                String successUrl = "http://localhost:5173/payment/success?orderId=" + orderId;
//
//                Payment payment = payPalService.createPayment(
//                        totalPrice.doubleValue(),
//                        "EUR",
//                        "paypal",
//                        "sale",
//                        "Order " + orderId,
//                        cancelUrl,
//                        successUrl
//                );
//
//                orderService.updateOrderPaymentId(orderId, payment.getId());
//
//                String approvalUrl = payment.getLinks().stream()
//                        .filter(link -> "approval_url".equals(link.getRel()))
//                        .findFirst()
//                        .map(Links::getHref)
//                        .orElseThrow(() -> new PayPalRESTException("No approval URL found"));
//
//                return ResponseEntity.ok(Map.of(
//                        "success", true,
//                        "approvalUrl", approvalUrl,
//                        "orderId", orderId
//                ));
//            } catch (PayPalRESTException e) {
//                return ResponseEntity.badRequest()
//                        .body(Map.of("error", "PayPal payment error: " + e.getMessage()));
//            }
//        }
//
//        return ResponseEntity.badRequest()
//                .body(Map.of("error", "Invalid payment method"));
//    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequestDTO checkoutRequest,
                                      Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "User not authenticated"));
        }

        ApplicationUser user = applicationUserRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return cartService.processCheckout(checkoutRequest, user);
    }

}
