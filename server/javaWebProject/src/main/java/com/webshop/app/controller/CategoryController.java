package com.webshop.app.controller;


import com.webshop.app.dto.CategoryDTO;
import com.webshop.app.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Integer id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryDTO categoryDTO) {
        try {
            CategoryDTO savedCategory = categoryService.saveCategory(categoryDTO);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Kategorija uspješno kreirana",
                    "category", savedCategory
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Greška prilikom kreiranja kategorije: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Integer id,
            @RequestBody CategoryDTO categoryDTO) {
        try {
            categoryDTO.setId(Long.valueOf(id));
            CategoryDTO updatedCategory = categoryService.saveCategory(categoryDTO);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Kategorija uspješno ažurirana",
                    "category", updatedCategory
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Greška prilikom ažuriranja kategorije: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        try {
            categoryService.deleteById(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Kategorija uspješno obrisana"
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Greška prilikom brisanja kategorije: " + e.getMessage()
            ));
        }
    }
}
