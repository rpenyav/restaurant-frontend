import React from "react";
import { useAuth } from "../context/AuthContext";

const HeaderComponent: React.FC = () => {
  const { user } = useAuth();

  return (
    <header>
      <h1>Restaurante</h1>
      {user && (
        <div>
          Camarero: {user.name} {user.surname}
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
