package com.webshop.app.filter;

import com.webshop.app.model.RequestLog;
import com.webshop.app.repository.RequestLogRepository;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@WebFilter("/*")
@Component
@RequiredArgsConstructor
public class RequestTimingFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(RequestTimingFilter.class);
    private final RequestLogRepository requestLogRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        long startTime = System.currentTimeMillis();

        chain.doFilter(request, response);

        long duration = System.currentTimeMillis() - startTime;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        RequestLog log = new RequestLog();
        log.setEndpoint(httpRequest.getRequestURI());
        log.setMethod(httpRequest.getMethod());
        log.setDuration(duration);
        log.setTimestamp(LocalDateTime.now());
        log.setUsername(httpRequest.getRemoteUser());
        log.setIpAddress(httpRequest.getRemoteAddr());
        requestLogRepository.save(log);

    }
}
