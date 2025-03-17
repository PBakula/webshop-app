import { useNavigate, useLocation } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = () => {
    const from = (location.state as any)?.from?.pathname || "/";
    navigate(from, { replace: true });
  };

  return { handleLoginSuccess };
};
