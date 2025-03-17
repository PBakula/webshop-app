package com.webshop.app.service;

import com.webshop.app.dto.ProductDTO;
import com.webshop.app.exception.ResourceNotFoundException;
import com.webshop.app.model.Category;
import com.webshop.app.model.Product;
import com.webshop.app.repository.CategoryRepository;
import com.webshop.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final CategoryRepository categoryRepository;

    @Value("${app.image.upload-dir}")
    private String uploadDir;

    @Value("${app.image.default-image}")
    private String defaultImageUrl;



    public ProductDTO getProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Proizvod nije pronađen s ID-jem: " + productId));
        return convertProductToDTO(product);
    }

    public ProductDTO saveProduct(ProductDTO productDTO, MultipartFile imageFile) throws IOException {
        String imageUrl = processImageUpload(imageFile);
        productDTO.setImageUrl(imageUrl);

        Product product = convertDTOToProduct(productDTO);
        Product savedProduct = productRepository.save(product);

        return convertProductToDTO(savedProduct);
    }

    public ProductDTO updateProduct(Integer productId, ProductDTO productDTO, MultipartFile imageFile) throws IOException {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Proizvod nije pronađen s ID-jem: " + productId));

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = processImageUpload(imageFile);
            productDTO.setImageUrl(imageUrl);
        } else {
            productDTO.setImageUrl(existingProduct.getImageUrl());
        }

        Product updatedProduct = convertDTOToProduct(productDTO);
        updatedProduct.setId(existingProduct.getId());
        productRepository.save(updatedProduct);

        return convertProductToDTO(updatedProduct);
    }

    public void deleteProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Proizvod nije pronađen"));

        product.setDeleted(true);
        productRepository.save(product);
    }


    public String processImageUpload(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return defaultImageUrl;
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return "/" + fileName;
    }

    public ProductDTO convertProductToDTO(Product product) {
        ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
        if (product.getCategory() != null) {
            productDTO.setCategoryId((long) product.getCategory().getId());
            productDTO.setCategoryName(product.getCategory().getName());
        }
        return productDTO;
    }

    public Product convertDTOToProduct(ProductDTO productDTO) {
        Product product = modelMapper.map(productDTO, Product.class);

        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(Math.toIntExact(productDTO.getCategoryId()))
                    .orElseThrow(() -> new RuntimeException("Kategorija ne postoji, ID: " + productDTO.getCategoryId()));
            product.setCategory(category);
        }
        return product;
    }

    public List<ProductDTO> getAllProducts(String sortBy, String sortOrder) {
        List<Product> products;

        if (sortBy != null && sortBy.equals("price")) {
            Sort sort = sortOrder != null && sortOrder.equals("desc") ?
                    Sort.by("price").descending() :
                    Sort.by("price").ascending();

            products = productRepository.findByDeletedFalse(sort);
        } else {
            products = productRepository.findByDeletedFalse();
        }

        return products.stream()
                .map(this::convertProductToDTO)
                .toList();
    }

    public List<ProductDTO> getProductsByCategoryId(Integer categoryId, String sortBy, String sortOrder) {
        List<Product> products;

        if (sortBy != null && sortBy.equals("price")) {
            Sort sort = sortOrder != null && sortOrder.equals("desc") ?
                    Sort.by("price").descending() :
                    Sort.by("price").ascending();

            products = productRepository.findByCategoryIdAndDeletedFalse(categoryId, sort);
        } else {
            products = productRepository.findByCategoryIdAndDeletedFalse(categoryId);
        }

        return products.stream()
                .map(this::convertProductToDTO)
                .toList();
    }
}
