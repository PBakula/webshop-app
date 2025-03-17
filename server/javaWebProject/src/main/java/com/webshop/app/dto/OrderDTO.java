package com.webshop.app.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.webshop.app.model.ApplicationUser;
import com.webshop.app.model.PaymentMethod;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    @JsonIgnore
    private ApplicationUser user;

    private Long userId;
    private String userFirstName;
    private String userLastName;
    private String userEmail;

    private List<CartItemDTO> items;
    private BigDecimal totalPrice;
    private String shippingAddress;
    private PaymentMethod paymentMethod;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime orderDate;
    private String status;

}

