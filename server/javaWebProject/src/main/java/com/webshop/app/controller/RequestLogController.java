package com.webshop.app.controller;

import com.webshop.app.model.RequestLog;
import com.webshop.app.service.RequestLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/request-log")
@RequiredArgsConstructor
public class RequestLogController {

    private final RequestLogService requestLogService;

    @GetMapping
    public ResponseEntity<List<RequestLog>> getAllRequestLogs() {
        List<RequestLog> logs = requestLogService.getAllLogs();
        return ResponseEntity.ok(logs);
    }
}
