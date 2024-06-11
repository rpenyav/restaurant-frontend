import React, { useState } from "react";

interface BuscadorFacturasProps {
  onSearch: (searchTerm: string) => void;
}

const BuscadorFacturas: React.FC<BuscadorFacturasProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <input
      type="search"
      className="form-control maxlength-select"
      placeholder="Buscar facturas..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
  );
};

export default BuscadorFacturas;
