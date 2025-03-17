package com.webshop.app.service;

import com.webshop.app.dto.CartDTO;
import com.webshop.app.dto.OrderDTO;
import com.webshop.app.model.ApplicationUser;
import com.webshop.app.model.OrderStatus;
import com.webshop.app.model.PaymentMethod;

import java.util.List;

public interface OrderService {

   void createOrder(CartDTO cartDTO, ApplicationUser applicationUser, PaymentMethod paymentMethod, String shippingAddress);
   List<OrderDTO> getAllOrders();
   List<OrderDTO> getOrdersForCurrentUser();

   Long createPendingOrder(CartDTO cartDTO, ApplicationUser applicationUser, PaymentMethod paymentMethod, String shippingAddress);
   void updateOrderPaymentId(Long orderId, String paymentId);
   boolean validateOrderPayment(Long orderId, String paymentId);
   void confirmOrder(Long orderId);
   void cancelOrder(Long orderId, String reason);
   OrderStatus getOrderStatus(Long orderId);
   OrderDTO getOrderById(Long orderId);
}
