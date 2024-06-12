import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import BuscadorFacturas from "./BuscadorFacturas";
import useSearch from "../hooks/useSearch";
import useFacturaList from "src/hooks/useFacturaList";

const FacturaList: React.FC = () => {
  const { t } = useTranslation();
  const { facturas, page, totalPages, setPage, loading } = useFacturaList();
  const { filteredFacturas, handleSearch } = useSearch(facturas);
  const navigate = useNavigate();

  const handleViewDetail = (pedidoId: string) => {
    navigate(`/factura-detail/${pedidoId}`);
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
          {loading ? (
            <tr>
              <td colSpan={3}>{t("loading")}</td>
            </tr>
          ) : (
            filteredFacturas.map((factura) => (
              <tr key={factura._id}>
                <td>{new Date(factura.fecha).toLocaleDateString()}</td>
                <td>{factura.facturacion_total.toFixed(2)}€</td>
                <td width={"5%"}>
                  <button
                    className="btn btn-listado"
                    onClick={() =>
                      handleViewDetail(factura.identificador_pedido)
                    }
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev: any) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          {t("anterior")}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev: any) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          {t("siguiente")}
        </button>
      </div>
    </div>
  );
};

export default FacturaList;
