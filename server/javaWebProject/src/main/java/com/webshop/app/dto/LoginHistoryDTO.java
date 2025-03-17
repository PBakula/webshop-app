package com.webshop.app.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LoginHistoryDTO {

    private Long id;
    private String userEmail;
    private String userFirstName;
    private String userLastName;
    private LocalDateTime timestamp;
    private String ipAddress;
}
