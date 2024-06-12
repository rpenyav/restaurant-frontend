import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="container text-center mt-5" style={{ minHeight: "400px" }}>
      <h1 style={{ fontSize: "120px" }}>404</h1>
      <p>{t("lo_sentimos_404")}</p>
    </div>
  );
};

export default NotFound;
