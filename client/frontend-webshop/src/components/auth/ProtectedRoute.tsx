import React, { FC, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { UserRoleName } from "../../types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRoleName;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    const checkAuthentication = async () => {
      try {
        await authService.refreshSession();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isChecking) {
    return <div>Učitavanje...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user && user.role && user.role.name !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
