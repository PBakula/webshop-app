export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface ProductFilters {
  categoryId?: string;
  sortBy?: "price";
  sortOrder?: "asc" | "desc";
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartResponse {
  cartItems: CartItem[];
  totalAmount: number;
}

export interface CheckoutRequest {
  paymentMethod: "CASH" | "PAYPAL";
  shippingAddress: string;
}
