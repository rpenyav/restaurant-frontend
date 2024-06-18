import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const NavbarComponent: React.FC = () => {
  const { user } = useAuth();
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav>
      <Link className="navbar-brand" to="/orders">
        {t("pedidos")}
      </Link>{" "}
      |{" "}
      {user?.role === "admin" && (
        <>
          <Link className="navbar-brand" to="/facturas">
            {t("facturas")}
          </Link>{" "}
          |{" "}
          <Link className="navbar-brand" to="/salas-mesas">
            {t("salas_y_mesas")}
          </Link>{" "}
          |{" "}
        </>
      )}
      <button className="btn btn-listado" onClick={() => changeLanguage("en")}>
        EN
      </button>
      <button className="btn btn-listado" onClick={() => changeLanguage("es")}>
        ES
      </button>
    </nav>
  );
};

export default NavbarComponent;
