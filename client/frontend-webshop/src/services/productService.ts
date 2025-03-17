import api from "./api";
import { Product, ProductFilters } from "../types/models";

export class ProductService {
  async getAllProducts(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      const response = await api.get<Product[]>("/products", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Greška pri dohvaćanju proizvoda"
      );
    }
  }
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Greška pri dohvaćanju proizvoda"
      );
    }
  }

  async createProduct(
    product: Partial<Product>,
    imageFile?: File
  ): Promise<Product> {
    try {
      const formData = new FormData();
      const productBlob = new Blob([JSON.stringify(product)], {
        type: "application/json",
      });

      formData.append("product", productBlob);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const response = await api.post<{
        success: boolean;
        message: string;
        product: Product;
      }>("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.product;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Greška pri kreiranju proizvoda"
      );
    }
  }

  async updateProduct(
    id: number,
    product: Partial<Product>,
    imageFile?: File
  ): Promise<Product> {
    try {
      const formData = new FormData();
      const productBlob = new Blob([JSON.stringify(product)], {
        type: "application/json",
      });

      formData.append("product", productBlob);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const response = await api.put<{
        success: boolean;
        message: string;
        product: Product;
      }>(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.product;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Greška pri ažuriranju proizvoda"
      );
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Greška pri brisanju proizvoda"
      );
    }
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}

export const productService = new ProductService();
