package com.webshop.app.service;

import com.webshop.app.dto.CartItemDTO;
import com.webshop.app.dto.CheckoutRequestDTO;
import com.webshop.app.model.ApplicationUser;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

public interface CartService {

    BigDecimal getTotalAmount(List<CartItemDTO> cartItems);
    ResponseEntity<?> processCheckout(CheckoutRequestDTO checkoutRequest, ApplicationUser user);
}
