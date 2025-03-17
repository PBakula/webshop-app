package com.webshop.app.service;

import com.webshop.app.model.RequestLog;
import com.webshop.app.repository.RequestLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestLogServiceImpl implements RequestLogService {

    private final RequestLogRepository requestLogRepository;

    public List<RequestLog> getAllLogs() {
        return requestLogRepository.findAll();
    }
}
