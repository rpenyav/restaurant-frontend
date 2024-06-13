import { useState, useEffect } from "react";
import axios from "../api/axios";
import { FacturaSearch } from "../interfaces/factura";

const useFacturaList = () => {
  const [facturas, setFacturas] = useState<FacturaSearch[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/facturas?page=${page}&limit=10`);
        setFacturas(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching facturas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, [page]);

  return { facturas, page, totalPages, setPage, loading };
};

export default useFacturaList;
