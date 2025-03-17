package com.webshop.app.repository;

import com.webshop.app.model.ApplicationUser;
import com.webshop.app.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(ApplicationUser user);
}