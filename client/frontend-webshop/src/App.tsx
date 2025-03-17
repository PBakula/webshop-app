import React, { FC } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavigationBar from "./components/layout/Navbar";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { PaymentResultPage } from "./pages/PaymentResultPage";
import OrderUserPage from "./pages/OrderUserPage";

import "./App.css";
import ProductsAdminPage from "./pages/ProductsAdminPage";
import CategoriesAdminPage from "./pages/CategoriesAdminPage";
import LoginHistoryPage from "./pages/LoginHistoryPage";
import RequestLogPage from "./pages/RequestLogPage";
import OrderAdminPage from "./pages/OrderAdminPage";

const App: FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/payment/success" element={<PaymentResultPage />} />
          <Route path="/payment/cancel" element={<PaymentResultPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="USER">
                <OrderUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ProductsAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CategoriesAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/history-log"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <LoginHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/request-log"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <RequestLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <OrderAdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
