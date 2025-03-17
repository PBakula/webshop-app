// src/services/orderService.ts
import api from "./api";

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  items: CartItem[];
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  orderDate: string;
  status?: string;
}

class OrderService {
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await api.get("/orders/all", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Greška pri dohvaćanju svih narudžbi:", error);
      throw error;
    }
  }

  async getMyOrders(): Promise<Order[]> {
    try {
      const response = await api.get("/orders/user/current", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Greška pri dohvaćanju narudžbi:", error);
      throw error;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }

  async getOrderById(orderId: string | number): Promise<Order> {
    try {
      const response = await api.get(`/orders/${orderId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Greška pri dohvaćanju narudžbe:", error);
      throw error;
    }
  }
}

export default new OrderService();
