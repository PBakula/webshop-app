package com.webshop.app.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {

    private List<CartItemDTO> items;
    private BigDecimal totalPrice;
}
