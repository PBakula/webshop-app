import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import orderService, { Order } from "../services/orderService";

const OrderUserPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError("Error fetching orders, please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="py-4">
        <h1 className="mb-4">My orders</h1>
        <Card>
          <Card.Body className="text-center">
            <p className="text-muted">Order list is empty</p>
            <Link to="/products" className="btn btn-primary mt-3">
              Back to products page
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">My orders</h1>

      <Row>
        <Col xs={12}>
          {orders.map((order) => (
            <Card key={order.id} className="mb-4">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Order #{order.id}</h5>
                  <small className="text-muted">
                    {orderService.formatDate(order.orderDate)}
                  </small>
                </div>
              </Card.Header>
              <Card.Body>
                <h6 className="card-subtitle mb-2">Products:</h6>
                <ListGroup className="mb-3">
                  {order.items.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between"
                    >
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span>
                        {orderService.formatPrice(item.price * item.quantity)}
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <div className="mb-3">
                  <h6>Shipping address: {order.shippingAddress}</h6>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <span>Payment type: {order.paymentMethod}</span>
                  <span className="fw-bold fs-5">
                    Total: {orderService.formatPrice(order.totalPrice)}
                  </span>
                </div>

                {order.status && (
                  <div className="mt-3">
                    <Badge bg="primary">{order.status}</Badge>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderUserPage;
