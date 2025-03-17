package com.webshop.app.controller;

import com.webshop.app.dto.AuthRequestDTO;
import com.webshop.app.dto.RegisterDTO;
import com.webshop.app.dto.UserInfoDTO;
import com.webshop.app.model.ApplicationUser;
import com.webshop.app.dto.MessageResponseDTO;
import com.webshop.app.model.RefreshToken;
import com.webshop.app.service.JwtService;
import com.webshop.app.service.RefreshTokenService;
import com.webshop.app.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api")
@AllArgsConstructor
public class UserAuthController {

    private AuthenticationManager authenticationManager;

    private JwtService jwtService;

    private RefreshTokenService refreshTokenService;

    private UserService userService;


    @PostMapping("/login")
    public ResponseEntity<UserInfoDTO> authenticateAndGetToken(@RequestBody AuthRequestDTO authRequestDTO, HttpServletResponse response) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequestDTO.getEmail(), authRequestDTO.getPassword())
        );

        if (authentication.isAuthenticated()) {
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequestDTO.getEmail());

            ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                    .httpOnly(true)
                    .secure(false)
                    .path("/api")
                    .maxAge(7 * 24 * 60 * 60) // 7 days
                    .sameSite("Lax")
                    .build();

            String accessToken = jwtService.generateToken(authRequestDTO.getEmail());

            ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(30 * 60) // 30 minutes
                    .sameSite("Lax")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());

            ApplicationUser user = userService.findByEmail(authRequestDTO.getEmail());
            UserInfoDTO userInfo = new UserInfoDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole());

            return ResponseEntity.ok(userInfo);
        } else {
            throw new UsernameNotFoundException("Invalid user request.");
        }
    }


    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                          HttpServletResponse response) {
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(new MessageResponseDTO("No refresh token provided"));
        }

        Optional<RefreshToken> tokenOptional = refreshTokenService.findByToken(refreshToken);

        if (tokenOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponseDTO("Invalid refresh token"));
        }

        try {
            RefreshToken token = refreshTokenService.verifyExpiration(tokenOptional.get());
            ApplicationUser applicationUser = token.getApplicationUser();

            String accessToken = jwtService.generateToken(applicationUser.getEmail());

            ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(30 * 60) // 30 minutes
                    .sameSite("Strict")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());

            UserInfoDTO userInfo = new UserInfoDTO(
                    applicationUser.getId(),
                    applicationUser.getFirstName(),
                    applicationUser.getLastName(),
                    applicationUser.getEmail(),
                    applicationUser.getRole()
            );

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponseDTO("Token verification failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear access token cookie
        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        // Clear refresh token cookie
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/api")
                .maxAge(0)
                .build();

        // Add cookies to response
        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        return ResponseEntity.ok(new MessageResponseDTO("Logged out successfully"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDTO registerDTO) {
        if (userService.findByEmailRegister(registerDTO.getEmail()) != null) {
            return ResponseEntity.badRequest().body(new MessageResponseDTO("Email je već registriran!"));
        }

        if (!registerDTO.getPassword().equals(registerDTO.getRepeatPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponseDTO("Lozinke se ne podudaraju!"));
        }

        ApplicationUser newUser = userService.register(registerDTO);
        return ResponseEntity.ok(new MessageResponseDTO("Korisnik uspješno registriran!"));
    }
}
