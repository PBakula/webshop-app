package com.webshop.app.dto;

import com.webshop.app.model.ApplicationUserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private ApplicationUserRole role;
}
