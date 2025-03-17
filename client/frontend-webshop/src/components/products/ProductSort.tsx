import React, { FC } from "react";
import { Form } from "react-bootstrap";
import { Category, ProductFilters } from "../../types/models";

interface ProductSortProps {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
}

export const ProductSort: FC<ProductSortProps> = ({
  categories,
  filters,
  onFilterChange,
}) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "sortOption") {
      onFilterChange({
        ...filters,
        sortBy: "price",
        sortOrder: (value as "asc" | "desc") || undefined,
      });
    } else {
      onFilterChange({
        ...filters,
        [name]: value || undefined,
      });
    }
  };

  return (
    <div className="d-flex gap-3 mb-4">
      <Form.Select
        name="categoryId"
        value={filters.categoryId || ""}
        onChange={handleFilterChange}
        className="w-auto"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Form.Select>

      <Form.Select
        name="sortOption"
        value={filters.sortOrder || ""}
        onChange={handleFilterChange}
        className="w-auto"
      >
        <option value="">Sort by price</option>
        <option value="asc">Price: Lower to high</option>
        <option value="desc">Price: High to lower</option>
      </Form.Select>
    </div>
  );
};
