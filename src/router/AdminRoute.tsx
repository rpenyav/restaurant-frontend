// AdminRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoaderComponent from "../components/LoaderComponent";

const AdminRoute: React.FC<{ element: React.FC }> = ({ element: Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoaderComponent />;
  }

  return user?.role && user?.role === "admin" ? (
    <Element />
  ) : (
    <Navigate to="/404" />
  );
};

export default AdminRoute;
