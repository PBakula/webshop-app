package com.webshop.app.dto;


import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequestDTO {

    private String paymentMethod;
    private String shippingAddress;
    private List<CartItemDTO> cartItems;
}
