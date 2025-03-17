package com.webshop.app.service;

import com.webshop.app.dto.LoginHistoryDTO;
import com.webshop.app.exception.UserNotFoundException;
import com.webshop.app.model.ApplicationUser;
import com.webshop.app.model.LoginHistory;
import com.webshop.app.repository.ApplicationUserRepository;
import com.webshop.app.repository.LoginHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoginHistoryServiceImpl implements LoginHistoryService {

    private final LoginHistoryRepository loginHistoryRepository;
    private final ApplicationUserRepository userRepository;
    private final ModelMapper modelMapper;

    public void saveLoginHistory(String email, String ipAddress) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email ne može biti prazan.");
        }

        ApplicationUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Korisnik s emailom " + email + " nije pronađen."));

        if ("ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            return;
        }

        LoginHistory history = new LoginHistory();
        history.setApplicationUser(user);
        history.setTimestamp(LocalDateTime.now());
        history.setIpAddress(ipAddress);
        loginHistoryRepository.save(history);
    }

    public List<LoginHistoryDTO> getAllLogins() {
        List<LoginHistory> loginHistories = loginHistoryRepository.findAll();
        return loginHistories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private LoginHistoryDTO convertToDTO(LoginHistory loginHistory) {
        LoginHistoryDTO dto = modelMapper.map(loginHistory, LoginHistoryDTO.class);

        if (loginHistory.getApplicationUser() != null) {
            dto.setUserEmail(loginHistory.getApplicationUser().getEmail());
            dto.setUserFirstName(loginHistory.getApplicationUser().getFirstName());
            dto.setUserLastName(loginHistory.getApplicationUser().getLastName());
        }

        return dto;
    }
}
