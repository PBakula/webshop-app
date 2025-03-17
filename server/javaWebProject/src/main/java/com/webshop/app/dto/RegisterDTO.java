package com.webshop.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {

    @NotEmpty(message = "Unesite svoje ime.")
    @Size(min = 1, max = 100, message = "Vaše ime mora imati između 1 i 100 znakova.")
    private String firstName;

    @NotEmpty(message = "Unesite svoje prezime.")
    @Size(min = 1, max = 100, message = "Vaše prezime mora imati između 1 i 100 znakova.")
    private String lastName;

    @NotEmpty(message = "Unesite svoj broj moobitela.")
    @Size(min = 1, max = 100, message = "Vaše prezime mora imati između 1 i 100 znakova.")
    private String phoneNumber;

    @NotEmpty(message = "Unesite svoj email.")
    @Email()
    private String email;

    @NotEmpty(message = "Unesite svoju lozinku.")
    @Size(min = 6, message = "Lozinka mora imati najmanje 6 znakova.")
    private String password;

    @NotEmpty(message = "Unesite svoju lozinku.")
    @Size(min = 6, message = "Lozinka mora imati najmanje 6 znakova.")
    private String repeatPassword;
}
