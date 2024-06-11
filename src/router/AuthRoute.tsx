import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AuthRoute: React.FC<{ element: React.FC }> = ({
  element: Element,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/orders" /> : <Element />;
};
