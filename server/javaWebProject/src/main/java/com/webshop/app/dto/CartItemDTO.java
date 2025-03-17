package com.webshop.app.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {

    private Integer productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
}
