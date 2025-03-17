import React, { FC } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { Product } from "../../types/models";
import { cartService } from "../../services/cartService";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    try {
      await cartService.addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart!");
    }
  };

  return (
    <Card
      className={`h-100 shadow-sm ${isOutOfStock ? "opacity-50" : ""}`}
      style={{ transition: "opacity 0.3s ease" }}
    >
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={`http://localhost:9090${product.imageUrl}`}
          alt={product.name}
          style={{
            height: "200px",
            objectFit: "contain",
            padding: "1rem",
            filter: isOutOfStock ? "grayscale(70%)" : "none",
          }}
        />
        {isOutOfStock && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          >
            <Badge bg="danger" className="px-3 py-2">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-2">{product.name}</Card.Title>
        <Card.Text className="text-muted flex-grow-1">
          {product.description}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="h5 mb-0">{product.price.toFixed(2)} €</span>
          <small
            className={`${isOutOfStock ? "text-danger fw-bold" : "text-muted"}`}
          >
            {isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
          </small>
        </div>
        <Button
          onClick={handleAddToCart}
          variant={isOutOfStock ? "secondary" : "primary"}
          className="w-100 d-flex align-items-center justify-content-center gap-2"
          disabled={isOutOfStock}
        >
          <FaShoppingCart /> {isOutOfStock ? "Out of Stock" : "Add to cart"}
        </Button>
      </Card.Body>
    </Card>
  );
};
