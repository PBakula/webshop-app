import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Alert } from "react-bootstrap";
import { CartItem, CartResponse } from "../types/models";
import { cartService } from "../services/cartService";
import { productService } from "../services/productService";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const CartPage = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      setError("Error while loading cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId: number, quantity: number) => {
    try {
      await cartService.updateCartItem(productId, quantity);
      loadCart();
    } catch (err) {
      setError("Error while updating cart");
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await cartService.removeFromCart(productId);
      loadCart();
    } catch (err) {
      setError("Error while removing product");
    }
  };

  const handleCheckout = async (paymentMethod: "CASH" | "PAYPAL") => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!shippingAddress) {
      setError("Please add shipping address");
      return;
    }

    try {
      const stockCheckResults = await Promise.all(
        cart!.cartItems.map(async (item) => {
          const product = await productService.getProductById(item.productId);
          return {
            productId: item.productId,
            name: item.name,
            requestedQuantity: item.quantity,
            availableQuantity: product.stock,
          };
        })
      );

      const outOfStockItems = stockCheckResults.filter(
        (item) => item.requestedQuantity > item.availableQuantity
      );

      if (outOfStockItems.length > 0) {
        const errorMessage = outOfStockItems
          .map(
            (item) =>
              `${item.name} (requested: ${item.requestedQuantity}, available: ${item.availableQuantity})`
          )
          .join(", ");
        setError(`Insufficient stock for: ${errorMessage}`);
        return;
      }
    } catch (err) {
      setError("Error checking product stock");
      return;
    }

    try {
      const response = await cartService.checkout({
        paymentMethod,
        shippingAddress,
      });

      console.log("Checkout response:", response);

      if (response.approvalUrl) {
        window.location.href = response.approvalUrl;
      } else if (response.success) {
        console.log(
          "Cash payment successful, redirecting with orderId:",
          response.orderId
        );
        setCart(null);
        navigate(`/payment/success?orderId=${response.orderId}`);
      }
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "You need to be logged in to submit order"
      ) {
        navigate("/login", { state: { from: location } });
      } else {
        setError("Error during checkout");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="py-4">
      {location.state?.message && (
        <Alert variant="success">{location.state.message}</Alert>
      )}
      {location.state?.error && (
        <Alert variant="danger">{location.state.error}</Alert>
      )}

      <h2>Cart</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!cart?.cartItems || cart.cartItems.length === 0 ? (
        <Alert variant="info">Cart is empty</Alert>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{item.price.toFixed(2)} €</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.productId,
                          parseInt(e.target.value)
                        )
                      }
                      style={{ width: "80px" }}
                    />
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)} €</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(item.productId)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Form className="mt-4">
            <Form.Group className="mb-3">
              <Form.Label>Shipping address</Form.Label>
              <Form.Control
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter shipping address"
                required
              />
            </Form.Group>
          </Form>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: {cart.totalAmount.toFixed(2)} €</h4>
            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleCheckout("CASH")}
              >
                Pay with cash
              </Button>
              <Button
                variant="primary"
                onClick={() => handleCheckout("PAYPAL")}
              >
                Pay with Paypal
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};
