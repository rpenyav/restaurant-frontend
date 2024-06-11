import React from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const HeaderComponent: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header-style">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Restaurante</h1>
          {user && (
            <div className="d-flex align-items-center">
              <div className="me-3">
                Camarero: {user.name} {user.surname}
              </div>
              <button className="btn btn-outline-danger" onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
