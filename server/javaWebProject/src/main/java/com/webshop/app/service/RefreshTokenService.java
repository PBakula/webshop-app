package com.webshop.app.service;

import com.webshop.app.exception.UserNotFoundException;
import com.webshop.app.model.RefreshToken;
import com.webshop.app.repository.ApplicationUserRepository;
import com.webshop.app.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    @Autowired
    ApplicationUserRepository applicationUserRepository;

    public RefreshToken createRefreshToken(String email){
        RefreshToken refreshToken = RefreshToken.builder()
                .applicationUser(applicationUserRepository.findByEmail(email)
                        .orElseThrow(() -> new UserNotFoundException("User not found")))
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(600000))
                .build();
        saveOrUpdateToken(refreshToken);
        return refreshToken;
    }


    public Optional<RefreshToken> findByToken(String token){
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token){
        if(token.getExpiryDate().compareTo(Instant.now())<0){
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token is expired. Please make a new login..!");
        }
        return token;
    }

    public void saveOrUpdateToken(RefreshToken refreshToken) {
        Optional<RefreshToken> existingToken = refreshTokenRepository.findByApplicationUser_Id(Long.valueOf(refreshToken.getApplicationUser().getId()));
        if (existingToken.isPresent()) {
            RefreshToken token = existingToken.get();
            token.setToken(refreshToken.getToken());
            token.setExpiryDate(refreshToken.getExpiryDate());
            refreshTokenRepository.save(token);
        } else {
            refreshTokenRepository.save(refreshToken);
        }
    }
}
