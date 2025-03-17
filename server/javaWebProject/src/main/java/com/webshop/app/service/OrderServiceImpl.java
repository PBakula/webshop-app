package com.webshop.app.service;

import com.webshop.app.dto.CartDTO;
import com.webshop.app.dto.CartItemDTO;
import com.webshop.app.dto.OrderDTO;
import com.webshop.app.exception.ResourceNotFoundException;
import com.webshop.app.exception.UserNotFoundException;
import com.webshop.app.model.*;
import com.webshop.app.repository.ApplicationUserRepository;
import com.webshop.app.repository.OrderRepository;
import com.webshop.app.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ApplicationUserRepository applicationUserRepository;
//    private final CartService cartService;
    private final ModelMapper modelMapper;

    public List<OrderDTO> getOrdersForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ApplicationUser user = applicationUserRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Korisnik nije pronađen"));

        List<Order> orders = orderRepository.findByUser(user);

        return convertOrderToDTO(orders);
    }


    public void createOrder(CartDTO cartDTO, ApplicationUser applicationUser, PaymentMethod paymentMethod, String shippingAddress) {
        BigDecimal totalPrice = cartDTO.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderItem> orderItems = cartDTO.getItems().stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();


                    Product product = productRepository.findById(item.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found for ID: " + item.getProductId()));

                    orderItem.setProduct(product);
                    orderItem.setCategory(product.getCategory());
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setTotalPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));

                    orderItem.setOrder(null);

                    return orderItem;
                }).collect(Collectors.toList());


        Order order = new Order();
        order.setUser(applicationUser);
        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setPaymentMethod(paymentMethod);
        order.setOrderDate(LocalDateTime.now());
        order.setShippingAddress(shippingAddress);


        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(order);
        }


        orderRepository.save(order);
    }

    public List<OrderDTO> getAllOrders() {

        List<Order> orders = orderRepository.findAll();

        return convertOrderToDTO(orders);
    }


    @Override
    @Transactional
    public Long createPendingOrder(CartDTO cartDTO, ApplicationUser applicationUser, PaymentMethod paymentMethod, String shippingAddress) {
        BigDecimal totalPrice = cartDTO.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderItem> orderItems = cartDTO.getItems().stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();

                    Product product = productRepository.findById(item.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found for ID: " + item.getProductId()));

                    orderItem.setProduct(product);
                    orderItem.setCategory(product.getCategory());
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setTotalPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));

                    orderItem.setOrder(null);

                    return orderItem;
                }).collect(Collectors.toList());

        Order order = new Order();
        order.setUser(applicationUser);
        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setPaymentMethod(paymentMethod);
        order.setOrderDate(LocalDateTime.now());
        order.setShippingAddress(shippingAddress);
        order.setStatus(OrderStatus.PENDING_PAYMENT);

        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(order);
        }

        Order savedOrder = orderRepository.save(order);
        return savedOrder.getId();
    }

    @Override
    @Transactional
    public void updateOrderPaymentId(Long orderId, String paymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Narudžba nije pronađena: " + orderId));
        order.setPaymentId(paymentId);
        orderRepository.save(order);
    }

    @Override
    public boolean validateOrderPayment(Long orderId, String paymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Narudžba nije pronađena: " + orderId));

        return order.getPaymentId() != null && order.getPaymentId().equals(paymentId);
    }

    @Override
    @Transactional
    public void confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Narudžba nije pronađena: " + orderId));

        order.setStatus(OrderStatus.CONFIRMED);

        for (OrderItem orderItem : order.getItems()) {
            Product product = orderItem.getProduct();
            int newStock = product.getStock() - orderItem.getQuantity();
            product.setStock(newStock);
            productRepository.save(product);
        }

        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Narudžba nije pronađena: " + orderId));

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    public OrderStatus getOrderStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalStateException("Narudžba nije pronađena, ID: " + orderId));
        return order.getStatus();
    }


    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Narudžba nije pronađena: " + orderId));

        return convertToDTO(order);
    }


    private OrderDTO convertToDTO(Order order) {
        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);

        orderDTO.setItems(order.getItems().stream()
                .map(item -> {
                    return new CartItemDTO(
                            Math.toIntExact(item.getProduct().getId()),
                            item.getProduct().getName(),
                            item.getProduct().getPrice(),
                            item.getQuantity()
                    );
                })
                .collect(Collectors.toList()));

        if (order.getStatus() != null) {
            orderDTO.setStatus(order.getStatus().toString());
        }

        if (order.getUser() != null) {
            orderDTO.setUserId(Long.valueOf(order.getUser().getId()));
            orderDTO.setUserFirstName(order.getUser().getFirstName());
            orderDTO.setUserLastName(order.getUser().getLastName());
            orderDTO.setUserEmail(order.getUser().getEmail());
        }

        return orderDTO;
    }

    private List<OrderDTO> convertOrderToDTO(List<Order> orders) {
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
