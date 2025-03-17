package com.webshop.app.controller;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.webshop.app.model.OrderStatus;
import com.webshop.app.service.CartService;
import com.webshop.app.service.OrderService;
import com.webshop.app.service.PaypalService;
import com.webshop.app.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Slf4j
public class PaymentController {

    private final PaypalService paypalService;
    private final UserService userService;
    private final CartService cartService;
    private final OrderService orderService;

    @GetMapping("/success")
    public ResponseEntity<?> paymentSuccess(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @RequestParam("orderId") Long orderId) {

        log.info("Payment success callback received: paymentId={}, payerId={}, orderId={}",
                paymentId, payerId, orderId);

        try {
            // Provjeri trenutni status narudžbe
            OrderStatus currentStatus = orderService.getOrderStatus(orderId);
            log.info("Current order status: {}", currentStatus);

            // Ako je narudžba već potvrđena, vrati uspjeh
            if (currentStatus == OrderStatus.CONFIRMED) {
                log.info("Order {} is already confirmed", orderId);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Narudžba je već potvrđena",
                        "orderId", orderId
                ));
            }

            // Ako je narudžba otkazana, vrati grešku
            if (currentStatus == OrderStatus.CANCELLED) {
                log.warn("Attempting to confirm cancelled order {}", orderId);
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Narudžba je otkazana i ne može se potvrditi",
                        "orderId", orderId
                ));
            }

            // Provjeri da li je status PENDING_PAYMENT
            if (currentStatus != OrderStatus.PENDING_PAYMENT) {
                log.warn("Order {} is not in PENDING_PAYMENT state, current state: {}", orderId, currentStatus);
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Narudžba nije u ispravnom stanju za potvrdu plaćanja."
                ));
            }

            // Pronađi narudžbu i provjeri da li odgovara paymentId
            if (!orderService.validateOrderPayment(orderId, paymentId)) {
                log.warn("Payment validation failed for order {}", orderId);
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Nevažeća narudžba ili plaćanje."
                ));
            }

            // Izvrši PayPal plaćanje
            log.info("Executing PayPal payment for order {}", orderId);
            Payment payment = paypalService.executePayment(paymentId, payerId);
            log.info("PayPal payment executed, status: {}", payment.getState());

            if ("approved".equals(payment.getState())) {
                log.info("Confirming order {}", orderId);
                orderService.confirmOrder(orderId);

                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Vaša narudžba je uspješno plaćena putem PayPala!",
                        "orderId", orderId
                ));
            }

            // Ako plaćanje nije odobreno, otkaži narudžbu
            log.warn("Payment not approved for order {}, state: {}", orderId, payment.getState());
            orderService.cancelOrder(orderId, "Plaćanje nije odobreno. Status: " + payment.getState());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Plaćanje nije odobreno.",
                    "paymentState", payment.getState(),
                    "orderId", orderId
            ));
        } catch (PayPalRESTException e) {
            // U slučaju greške, otkaži narudžbu
            log.error("PayPal execution error for order {}: {}", orderId, e.getMessage(), e);
            orderService.cancelOrder(orderId, "Greška u obradi plaćanja: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Došlo je do pogreške tijekom obrade PayPal plaćanja: " + e.getMessage(),
                    "orderId", orderId
            ));
        } catch (Exception e) {

            log.error("Unexpected error in payment processing for order {}: {}", orderId, e.getMessage(), e);
            try {
                orderService.cancelOrder(orderId, "Neočekivana greška: " + e.getMessage());
            } catch (Exception ex) {
                log.error("Failed to cancel order {} after error: {}", orderId, ex.getMessage());
            }
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Neočekivana greška: " + e.getMessage(),
                    "orderId", orderId
            ));
        }
    }

    @GetMapping("/cancel")
    public ResponseEntity<?> paymentCancel(@RequestParam("orderId") Long orderId) {
        log.info("Payment cancelled for order {}", orderId);

        orderService.cancelOrder(orderId, "Korisnik je otkazao plaćanje.");
        return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Plaćanje otkazano.",
                "orderId", orderId
        ));
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> checkOrderStatus(@PathVariable Long orderId) {
        try {
            OrderStatus status = orderService.getOrderStatus(orderId);
            return ResponseEntity.ok(Map.of(
                    "orderId", orderId,
                    "status", status.name(),
                    "isConfirmed", status == OrderStatus.CONFIRMED
            ));
        } catch (Exception e) {
            log.error("Error checking order status for order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Greška pri provjeri statusa narudžbe: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/error")
    public ResponseEntity<?> paymentError() {
        log.error("General payment error occurred");
        return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Payment error occurred."
        ));
    }
}
