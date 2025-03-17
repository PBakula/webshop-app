import api from "./api";
import { Category } from "../types/models";

export class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get<Category[]>("/categories");
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Greška pri dohvaćanju kategorija"
      );
    }
  }
  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await api.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Greška pri dohvaćanju kategorije"
      );
    }
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        category: Category;
      }>("/categories", category);
      return response.data.category;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Greška pri kreiranju kategorije"
      );
    }
  }

  async updateCategory(
    id: number,
    category: Partial<Category>
  ): Promise<Category> {
    try {
      const response = await api.put<{
        success: boolean;
        message: string;
        category: Category;
      }>(`/categories/${id}`, category);
      return response.data.category;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Greška pri ažuriranju kategorije"
      );
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Greška pri brisanju kategorije"
      );
    }
  }
}

export const categoryService = new CategoryService();
