// src/services/paymentService.ts
import api from "./api";

interface PaymentStatusResponse {
  status: string;
  isConfirmed: boolean;
}

interface PaymentSuccessResponse {
  success: boolean;
  message?: string;
}

class PaymentService {
  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await api.get(`/payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Greška pri dohvaćanju statusa plaćanja:", error);
      throw error;
    }
  }

  async confirmPayPalPayment(
    paymentId: string,
    PayerID: string,
    orderId: string
  ): Promise<PaymentSuccessResponse> {
    try {
      const response = await api.get(`/payment/success`, {
        params: { paymentId, PayerID, orderId },
      });
      return response.data;
    } catch (error) {
      console.error("Greška pri potvrđivanju PayPal plaćanja:", error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
