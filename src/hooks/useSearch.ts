import { useState, useEffect } from "react";
import { Factura } from "src/interfaces/factura";

interface SearchData {
  filteredFacturas: Factura[];
  handleSearch: (searchTerm: string) => void;
}

const useSearch = (initialData: Factura[]): SearchData => {
  const [filteredFacturas, setFilteredFacturas] =
    useState<Factura[]>(initialData);

  useEffect(() => {
    setFilteredFacturas(initialData);
  }, [initialData]);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setFilteredFacturas(initialData);
    } else {
      const filtered: Factura[] = initialData.filter((factura: Factura) => {
        const fecha: string = new Date(factura.fecha).toLocaleDateString();
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

  return { filteredFacturas, handleSearch };
};

export default useSearch;
