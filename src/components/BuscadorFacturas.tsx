import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface BuscadorFacturasProps {
  onSearch: (searchTerm: string) => void;
}

const BuscadorFacturas: React.FC<BuscadorFacturasProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <input
      type="search"
      className="form-control maxlength-select"
      placeholder={t("buscar_facturas")}
      value={searchTerm}
      onChange={handleSearchChange}
    />
  );
};

export default BuscadorFacturas;
