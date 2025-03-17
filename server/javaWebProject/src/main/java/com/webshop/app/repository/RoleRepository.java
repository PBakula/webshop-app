package com.webshop.app.repository;

import com.webshop.app.model.ApplicationUserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<ApplicationUserRole, Integer> {
    ApplicationUserRole findByName(String name);
}
