package com.webshop.app.service;

import com.webshop.app.dto.RegisterDTO;
import com.webshop.app.model.ApplicationUser;

public interface UserService {


      ApplicationUser findByEmail(String username);
      ApplicationUser register(RegisterDTO registerDTO);
      ApplicationUser findByEmailRegister(String email);

}
