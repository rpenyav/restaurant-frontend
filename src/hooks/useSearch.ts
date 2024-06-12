import { useState } from "react";
import { FacturaSearch } from "../interfaces/factura";
import { formatDate } from "../utils/dateUtils";

const useSearch = (facturas: FacturaSearch[]) => {
  const [filteredFacturas, setFilteredFacturas] =
    useState<FacturaSearch[]>(facturas);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setFilteredFacturas(facturas);
    } else {
      const filtered = facturas.filter((factura) => {
        const fecha = formatDate(factura.fecha);
        return (
          factura.identificador_pedido
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
          factura.facturacion_total.toString().includes(searchTerm)
        );
      });
      setFilteredFacturas(filtered);
    }
  };

  return {
    filteredFacturas,
    handleSearch,
  };
};

export default useSearch;
