import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEye } from "@fortawesome/free-solid-svg-icons";
import BuscadorFacturas from "./BuscadorFacturas";
import { FacturaSearch } from "../interfaces/factura";
import { searchFacturas } from "../services/searchService";
import { useTranslation } from "react-i18next";

interface FacturaResponse {
  data: FacturaSearch[];
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

const FacturaList: React.FC = () => {
  const { t } = useTranslation();
  const [facturas, setFacturas] = useState<FacturaSearch[]>([]);
  const [filteredFacturas, setFilteredFacturas] = useState<FacturaSearch[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFacturas();
  }, [page]);

  const fetchFacturas = async () => {
    try {
      const response = await axios.get<FacturaResponse>(
        `/facturas?page=${page}&limit=10`
      );
      setFacturas(response.data.data);
      setFilteredFacturas(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching facturas:", error);
    }
  };

  const handleViewDetail = (pedidoId: string) => {
    navigate(`/factura-detail/${pedidoId}`);
  };

  const handleSearch = async (searchTerm: string) => {
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

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-5">
        <h2>{t("listado_de_facturas")}</h2>
        <BuscadorFacturas onSearch={handleSearch} />
      </div>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>{t("fecha")}</th>
            <th>{t("total_facturacion")}</th>
            <th>{t("acciones")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredFacturas.map((factura) => (
            <tr key={factura._id}>
              <td>{formatDate(factura.fecha)}</td>
              <td>{factura.facturacion_total.toFixed(2)}€</td>
              <td width={"5%"}>
                <button
                  className="btn btn-listado"
                  onClick={() => handleViewDetail(factura.identificador_pedido)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          {t("anterior")}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          {t("siguiente")}
        </button>
      </div>
    </div>
  );
};

export default FacturaList;
