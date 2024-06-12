import React from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeaderComponent: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  return (
    <header className="header-style">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <h1>{t("app_restaurant")}</h1>
          {user && (
            <div className="d-flex align-items-center">
              <div className="me-3">
                {t("bartender")}:{" "}
                <Link className="navbar-brand" to="/profile">
                  {user.name} {user.surname}
                </Link>
              </div>
              <button className="btn btn-outline-danger" onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
