import api from "./api";
import { CartItem, CartResponse, CheckoutRequest } from "../types/models";

class CartService {
  private readonly CART_KEY = "cart_items";

  private saveCartToStorage(items: CartItem[]) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
  }

  private getCartFromStorage(): CartItem[] {
    const items = localStorage.getItem(this.CART_KEY);
    return items ? JSON.parse(items) : [];
  }

  async getCart(): Promise<CartResponse> {
    try {
      const items = this.getCartFromStorage();
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { cartItems: items, totalAmount };
    } catch (error) {
      throw new Error("Nije moguće dohvatiti košaricu");
    }
  }

  async addToCart(item: CartItem) {
    try {
      const items = this.getCartFromStorage();
      const existingItemIndex = items.findIndex(
        (i) => i.productId === item.productId
      );

      if (existingItemIndex > -1) {
        items[existingItemIndex].quantity += item.quantity;
      } else {
        items.push(item);
      }

      this.saveCartToStorage(items);
      return { success: true, message: "Proizvod dodan u košaricu" };
    } catch (error) {
      throw new Error("Nije moguće dodati proizvod u košaricu");
    }
  }

  async updateCartItem(productId: number, quantity: number) {
    try {
      const items = this.getCartFromStorage();
      const itemIndex = items.findIndex((i) => i.productId === productId);

      if (itemIndex > -1) {
        items[itemIndex].quantity = quantity;
        this.saveCartToStorage(items);
      }

      return { success: true, message: "Količina ažurirana" };
    } catch (error) {
      throw new Error("Nije moguće ažurirati količinu");
    }
  }

  async removeFromCart(productId: number) {
    const items = this.getCartFromStorage();
    const newItems = items.filter((i) => i.productId !== productId);
    this.saveCartToStorage(newItems);
  }

  async checkout(checkoutRequest: CheckoutRequest) {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]"); // Preuzmi košaricu iz localStorage-a
      const payload = { ...checkoutRequest, cartItems };

      console.log("Checkout payload:", JSON.stringify(payload, null, 2));

      const response = await api.post("/cart/checkout", payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        this.clearCart();
      }
      return response.data;
    } catch (error) {
      console.error("Checkout error:", error);
      if (error.response?.status === 401) {
        throw new Error("Morate biti prijavljeni za završetak kupnje");
      }
      throw new Error(
        error.response?.data?.error || "Greška prilikom završetka kupnje"
      );
    }
  }

  clearCart(): void {
    try {
      localStorage.removeItem(this.CART_KEY);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw new Error("Nije moguće očistiti košaricu");
    }
  }
}

export const cartService = new CartService();
