package com.webshop.app.service;

import com.webshop.app.dto.RegisterDTO;
import com.webshop.app.model.ApplicationUser;
import com.webshop.app.model.ApplicationUserRole;
import com.webshop.app.repository.ApplicationUserRepository;
import com.webshop.app.repository.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final ApplicationUserRepository applicationUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    public ApplicationUser register(RegisterDTO registerDTO) {
        ApplicationUser applicationUser = new ApplicationUser();
        applicationUser.setFirstName(registerDTO.getFirstName());
        applicationUser.setLastName(registerDTO.getLastName());
        applicationUser.setPhoneNumber(registerDTO.getPhoneNumber());
        applicationUser.setEmail(registerDTO.getEmail());
        applicationUser.setPassword(passwordEncoder.encode(registerDTO.getPassword()));


        ApplicationUserRole role = roleRepository.findByName("USER");
        applicationUser.setRole(role);

        applicationUser.setIsConfirmed(false);

        return applicationUserRepository.save(applicationUser);
    }

    @Override
    public ApplicationUser findByEmail(String email) {
        return applicationUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email '" + email + "' not found!"));
    }

    @Override
    public ApplicationUser findByEmailRegister(String email) {
        return applicationUserRepository.findByEmail(email).orElse(null);
    }


}
