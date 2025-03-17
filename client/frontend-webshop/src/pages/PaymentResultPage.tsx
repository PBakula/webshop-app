import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import orderService, { Order } from "../services/orderService";
import { paymentService } from "../services/paymentService";

export const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const completePayment = async () => {
      try {
        const paymentId = searchParams.get("paymentId");
        const PayerID = searchParams.get("PayerID");
        const orderId = searchParams.get("orderId");

        if (!orderId || orderId === "undefined") {
          setError("Missing or invalid order information");
          setLoading(false);
          return;
        }

        try {
          const orderData = await orderService.getOrderById(orderId);
          setOrderDetails(orderData);
        } catch (orderError) {
          console.error("Greška pri dohvaćanju detalja narudžbe:", orderError);
        }

        try {
          const statusResponse = await paymentService.getPaymentStatus(orderId);
          console.log("Current order status:", statusResponse);
          setOrderStatus(statusResponse.status);

          if (statusResponse.isConfirmed) {
            setSuccess(true);
            setLoading(false);
            return;
          }
        } catch (statusError) {
          console.warn("Order status error:", statusError);
        }

        if (!paymentId || !PayerID) {
          setError("Order not confirmed yet. Please contact support.");
          setLoading(false);
          return;
        }

        if (!authService.isAuthenticated()) {
          try {
            console.log("Refreshing session");
            await authService.refreshSession();
            console.log("Session successfuly refreshed");
          } catch (refreshError) {
            console.error("Unsuccesful session refresh:", refreshError);
          }
        }

        console.log("Pozivam endpoint za potvrdu plaćanja s parametrima:", {
          paymentId,
          PayerID,
          orderId,
        });

        const response = await paymentService.confirmPayPalPayment(
          paymentId,
          PayerID,
          orderId
        );
        console.log("Odgovor s payment/success endpointa:", response);

        if (response.success) {
          setSuccess(true);
        } else {
          setError(
            response.message || "Došlo je do greške prilikom obrade plaćanja."
          );
        }
      } catch (error: any) {
        console.error("Greška prilikom dovršavanja plaćanja:", error);
        try {
          const orderId = searchParams.get("orderId");
          if (orderId) {
            const statusResponse = await paymentService.getPaymentStatus(
              orderId
            );
            setOrderStatus(statusResponse.status);

            if (statusResponse.isConfirmed) {
              setSuccess(true);
              setLoading(false);
              return;
            }
          }
        } catch (statusError) {
          console.warn(
            "Nije moguće dohvatiti status narudžbe nakon greške:",
            statusError
          );
        }

        setError(
          error.response?.data?.message ||
            "Došlo je do neočekivane greške prilikom obrade plaćanja."
        );
      } finally {
        setLoading(false);
      }
    };

    completePayment();
  }, [searchParams]);

  const renderOrderDetails = () => {
    if (!orderDetails) return null;

    return (
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h4 className="mb-0">Order #{orderDetails.id}</h4>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="card-title">Customer Information</h5>
              <p className="card-text">
                <strong>Name:</strong> {orderDetails.userFirstName}{" "}
                {orderDetails.userLastName}
              </p>
              <p className="card-text">
                <strong>Email:</strong> {orderDetails.userEmail}
              </p>
              <p className="card-text">
                <strong>Shipping address:</strong>{" "}
                {orderDetails.shippingAddress}
              </p>
            </div>
            <div className="col-md-6">
              <h5 className="card-title">Order detail</h5>
              <p className="card-text">
                <strong>Payment type:</strong> {orderDetails.paymentMethod}
              </p>
              <p className="card-text">
                <strong>Order date:</strong>{" "}
                {orderService.formatDate(orderDetails.orderDate)}
              </p>
              {orderDetails.status && (
                <p className="card-text">
                  <strong>Order status:</strong> {orderDetails.status}
                </p>
              )}
            </div>
          </div>

          <h5 className="card-title">Ordered products</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{orderService.formatPrice(item.price)}</td>
                    <td className="text-end">
                      {orderService.formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
                <tr className="table-active">
                  <td colSpan={3} className="text-end">
                    <strong>Total:</strong>
                  </td>
                  <td className="text-end">
                    <strong>
                      {orderService.formatPrice(orderDetails.totalPrice)}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="mt-3">Proccesing payment...</h2>
      </div>
    );
  }

  if (error) {
    if (orderStatus === "CONFIRMED") {
      return (
        <div className="container mt-5">
          <div className="alert alert-success" role="alert">
            <h2>Thank you for your order!</h2>
            <p>Payment is successfuly proccesed!</p>
          </div>
          {renderOrderDetails()}
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Back to home page
          </button>
        </div>
      );
    }

    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h2>Error while processing payment!</h2>
          <p>{error}</p>
          <p>Order status: {orderStatus || "Nepoznat"}</p>
        </div>
        {orderDetails && renderOrderDetails()}
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Back to home page
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mt-5">
        <div className="alert alert-success" role="alert">
          <h2>Thank you for your order!</h2>
          <p>Payment is successfuly proccesed!</p>
        </div>
        {renderOrderDetails()}
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to home page
        </button>
      </div>
    );
  }

  return null;
};
