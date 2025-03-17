package com.webshop.app.service;

import com.webshop.app.dto.CategoryDTO;
import com.webshop.app.model.Category;

import java.util.List;

public interface CategoryService {

    List<CategoryDTO> getAllCategories();
    CategoryDTO convertCategoryToDTO(Category category);
    CategoryDTO getCategoryById(Integer id);
    CategoryDTO saveCategory(CategoryDTO categoryDTO);
    void deleteById(Integer id);
}
