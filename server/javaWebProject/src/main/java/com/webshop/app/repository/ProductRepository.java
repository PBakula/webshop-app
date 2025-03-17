package com.webshop.app.repository;

import com.webshop.app.model.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

        List<Product> findByCategoryId(int categoryId);
        List<Product> findByDeletedFalse();
        List<Product> findByCategoryIdAndDeletedFalse(Integer categoryId);
        List<Product> findByDeletedFalse(Sort sort);
        List<Product> findByCategoryIdAndDeletedFalse(Integer categoryId, Sort sort);

        @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
        long countProductsInCategory(@Param("categoryId") Long categoryId);
}
