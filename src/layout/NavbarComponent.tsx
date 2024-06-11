import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavbarComponent: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav>
      <Link className="navbar-brand" to="/orders">
        Pedidos
      </Link>{" "}
      |{" "}
      {user?.role === "admin" && (
        <Link className="navbar-brand" to="/facturas">
          Facturas
        </Link>
      )}
    </nav>
  );
};

export default NavbarComponent;
