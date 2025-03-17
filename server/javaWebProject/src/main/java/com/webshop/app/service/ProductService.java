package com.webshop.app.service;

import com.webshop.app.dto.ProductDTO;
import com.webshop.app.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {



    // Dohvati proizvode prema ID-u kategorije
    ProductDTO convertProductToDTO(Product product);
    Product convertDTOToProduct(ProductDTO productDTO);
    ProductDTO getProductById(Integer productId);
    void deleteProductById(Integer productId);
    String processImageUpload(MultipartFile file) throws IOException;
    ProductDTO updateProduct(Integer productId, ProductDTO productDTO, MultipartFile imageFile) throws IOException;
    ProductDTO saveProduct(ProductDTO productDTO, MultipartFile imageFile) throws IOException;
    List<ProductDTO> getAllProducts(String sortBy, String sortOrder);
    List<ProductDTO> getProductsByCategoryId(Integer categoryId, String sortBy, String sortOrder);
}
