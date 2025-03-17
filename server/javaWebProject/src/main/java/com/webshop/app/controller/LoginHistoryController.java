package com.webshop.app.controller;

import com.webshop.app.dto.LoginHistoryDTO;
import com.webshop.app.service.LoginHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history-log")
@RequiredArgsConstructor
public class LoginHistoryController {

    private final LoginHistoryService loginHistoryService;

    @GetMapping
    public ResponseEntity<List<LoginHistoryDTO>> getAllLoginHistory() {
        List<LoginHistoryDTO> history = loginHistoryService.getAllLogins();
        return ResponseEntity.ok(history);
    }
}
