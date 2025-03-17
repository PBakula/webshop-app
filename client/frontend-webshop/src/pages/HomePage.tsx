import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert, Row, Col } from "react-bootstrap";
import { Product, Category, ProductFilters } from "../types/models";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { ProductCard } from "../components/products/ProductCard";
import { ProductSort } from "../components/products/ProductSort";

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
      await fetchProducts();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsData = await productService.getAllProducts(filters);
      setProducts(productsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Došlo je do greške");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-80">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  return (
    <Container className="py-4">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <h2 className="mb-4">All products</h2>

      <ProductSort
        categories={categories}
        filters={filters}
        onFilterChange={setFilters}
      />

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
