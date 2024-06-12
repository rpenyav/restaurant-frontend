import React from "react";
import { useTranslation } from "react-i18next";

const FooterComponent: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="d-flex justify-content-center">
      <p>&copy; 2023 {t("footer_text")}</p>
    </footer>
  );
};

export default FooterComponent;
