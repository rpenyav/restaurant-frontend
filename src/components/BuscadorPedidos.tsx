import React, { useState } from "react";

interface BuscadorPedidosProps {
  onSearch: (searchTerm: string) => void;
}

const BuscadorPedidos: React.FC<BuscadorPedidosProps> = ({ onSearch }) => {
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
      placeholder="Buscar pedidos..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
  );
};

export default BuscadorPedidos;
