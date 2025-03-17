package com.webshop.app.service;

import com.webshop.app.dto.CategoryDTO;
import com.webshop.app.exception.ResourceNotFoundException;
import com.webshop.app.model.Category;
import com.webshop.app.repository.CategoryRepository;
import com.webshop.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;


    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .toList();
    }

    public CategoryDTO getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .map(this::convertCategoryToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Kategorija s ID-om " + id + " nije pronađena."));
    }

    public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
        Category category = convertDTOToCategory(categoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return convertCategoryToDTO(savedCategory);
    }

    public void deleteById(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Kategorija s ID-om " + id + " nije pronađena.");
        }
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        long productCount = productRepository.countProductsInCategory(Long.valueOf(id));
        if (productCount > 0) {
            throw new IllegalStateException("Ne možete obrisati kategoriju jer sadrži proizvode!");
        }

        categoryRepository.delete(category);
    }

    public CategoryDTO convertCategoryToDTO(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }

    public Category convertDTOToCategory(CategoryDTO categoryDTO) {
        return modelMapper.map(categoryDTO, Category.class);
    }
}
