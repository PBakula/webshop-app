package com.webshop.app.service;

import com.webshop.app.dto.LoginHistoryDTO;

import java.util.List;

public interface LoginHistoryService {

    void saveLoginHistory(String email, String ipAddress);
    List<LoginHistoryDTO>  getAllLogins();


}
