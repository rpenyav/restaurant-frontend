import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoaderComponent from "../components/LoaderComponent";

const PrivateRoute: React.FC<{ element: React.FC }> = ({
  element: Element,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoaderComponent />; // Muestra el componente de carga mientras se verifica la autenticación
  }

  return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;
