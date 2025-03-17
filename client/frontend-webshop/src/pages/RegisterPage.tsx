import React from "react";
import { RegisterForm } from "../components/auth/RegisterForm";
import { AuthLayout } from "../components/layout/AuthLayout";

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};
