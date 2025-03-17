package com.webshop.app.controller;

import com.webshop.app.dto.CategoryDTO;
import com.webshop.app.dto.ProductDTO;
import com.webshop.app.exception.FileSizeExceededException;
import com.webshop.app.service.CategoryService;
import com.webshop.app.service.ProductService;
import com.webshop.app.utils.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @Value("${app.image.upload-dir}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 2L * 1024L * 1024L; // 2 MB

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {

        List<ProductDTO> products;
        if (categoryId != null) {
            products = productService.getProductsByCategoryId(categoryId.intValue(), sortBy, sortOrder);
        } else {
            products = productService.getAllProducts(sortBy, sortOrder);
        }

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id.intValue());
        return ResponseEntity.ok(product);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                validateAndSetImage(productDTO, imageFile);
            }

            ProductDTO savedProduct = productService.saveProduct(productDTO, imageFile);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Proizvod uspješno kreiran",
                    "product", savedProduct
            ));
        } catch (FileSizeExceededException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Greška prilikom kreiranja proizvoda: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        try {
            productDTO.setId(id);

            if (imageFile != null && !imageFile.isEmpty()) {
                validateAndSetImage(productDTO, imageFile);
            } else {
                ProductDTO existing = productService.getProductById(id.intValue());
                productDTO.setImageUrl(existing.getImageUrl());
            }

            ProductDTO updatedProduct = productService.updateProduct(id.intValue(), productDTO, imageFile);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Proizvod uspješno ažuriran",
                    "product", updatedProduct
            ));
        } catch (FileSizeExceededException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Greška prilikom ažuriranja proizvoda: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProductById(id.intValue());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Proizvod uspješno obrisan"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Greška prilikom brisanja proizvoda: " + e.getMessage()
            ));
        }
    }

    private void validateAndSetImage(ProductDTO productDTO, MultipartFile imageFile)
            throws FileSizeExceededException, IOException {
        if (imageFile.getSize() > MAX_FILE_SIZE) {
            throw new FileSizeExceededException("Slika je prevelika! Maksimalno 2MB.");
        }

        String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
        String imageUrl = ImageUtils.saveFile(uploadDir, fileName, imageFile);
        productDTO.setImageUrl(imageUrl);
    }
}
