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
  Form,
  Button,
} from "react-bootstrap";
import orderService, { Order } from "../services/orderService";

const OrderAdminPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getAllOrders();
        setOrders(data);
        setFilteredOrders(data);
        setError(null);
      } catch (err) {
        setError("Error fetching orders, please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on search term and status
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userFirstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING_PAYMENT":
        return "warning";
      case "CANCELLED":
        return "danger";
      default:
        return "primary";
    }
  };

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

  return (
    <Container className="py-4">
      <h1 className="mb-4">All Orders (Admin View)</h1>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Group>
                <Form.Label>Search by customer or order ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING_PAYMENT">Pending Payment</option>
                  <option value="CANCELLED">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filteredOrders.length === 0 ? (
        <Alert variant="info">No orders found matching your criteria.</Alert>
      ) : (
        <Row>
          <Col xs={12}>
            {filteredOrders.map((order) => (
              <Card key={order.id} className="mb-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Order #{order.id}</h5>
                    <Badge bg={getStatusBadgeVariant(order.status)}>
                      {order.status || "Processing"}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <h6 className="fw-bold">Customer Information:</h6>
                      <p className="mb-1">
                        Name: {order.userFirstName} {order.userLastName}
                      </p>
                      <p className="mb-1">Email: {order.userEmail}</p>
                      <p className="mb-1">ID: {order.userId}</p>
                    </Col>
                    <Col md={6}>
                      <h6 className="fw-bold">Order Details:</h6>
                      <p className="mb-1">
                        Date: {orderService.formatDate(order.orderDate)}
                      </p>
                      <p className="mb-1">Payment: {order.paymentMethod}</p>
                      <p className="mb-1">
                        Shipping to: {order.shippingAddress}
                      </p>
                    </Col>
                  </Row>

                  <h6 className="fw-bold mb-2">Ordered Products:</h6>
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

                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <span className="fw-bold fs-5">
                      Total: {orderService.formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OrderAdminPage;
