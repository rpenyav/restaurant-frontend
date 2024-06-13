import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import useOrderList from "../hooks/useOrderList";
import useAlert from "../hooks/useAlert";
import BuscadorPedidos from "./BuscadorPedidos";
import { formatDateToDDMMYYYY } from "../utils/dateUtils";
import LoaderComponent from "./LoaderComponent";

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showConfirmAlert, showSuccessAlert, showErrorAlert } = useAlert();
  const {
    page,
    setPage,
    limit,
    filteredOrders,
    loading,
    error,
    clearError,
    salaInfo,
    userInfo,
    facturados,
    handleStateChange,
    handleDeleteOrder,
    handleSearch,
  } = useOrderList();

  const confirmDeleteOrder = (id: string) => {
    showConfirmAlert("swal_estas_seguro", "swal_no_revertir", () =>
      handleDeleteOrder(id)
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-5">
        <h2>{t("pedidos")}</h2>
        <BuscadorPedidos onSearch={handleSearch} />
      </div>
      {error && (
        <div style={{ color: "red" }}>
          {error}
          <button onClick={clearError}>X</button>
        </div>
      )}
      <table className="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th>{t("mesa")}</th>
            <th>{t("estado")}</th>
            <th>{t("bartender")}</th>
            <th>{t("fecha")}</th>
            <th>{t("acciones")}</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: limit }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton width={100} height={40} />
                  </td>
                </tr>
              ))
            : filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {salaInfo[order.mesa_id]
                      ? `${salaInfo[order.mesa_id].nombre} - ${t("mesa")} ${
                          salaInfo[order.mesa_id].numero
                        }`
                      : order.mesa_id}
                  </td>
                  <td>
                    {facturados.has(order._id!) ? t("facturado") : order.estado}
                  </td>
                  <td>
                    {userInfo[order.camarero_id]
                      ? `${userInfo[order.camarero_id].name} ${
                          userInfo[order.camarero_id].surname
                        }`
                      : order.camarero_id}
                  </td>
                  <td>{formatDateToDDMMYYYY(order.fecha)}</td>
                  <td className="text-center" width={"10%"}>
                    {order.estado === "open" ? (
                      <button
                        className="btn btn-listado bgstatus-green"
                        onClick={() => handleStateChange(order._id!, "closed")}
                        disabled={facturados.has(order._id!)}
                      >
                        <FontAwesomeIcon className="btn-icono" icon={faCheck} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-listado bgstatus-red"
                        onClick={() => handleStateChange(order._id!, "open")}
                        disabled={facturados.has(order._id!)}
                      >
                        <FontAwesomeIcon className="btn-icono" icon={faTimes} />
                      </button>
                    )}
                    <button
                      className="btn btn-listado"
                      onClick={() => navigate(`/update-order/${order._id}`)}
                    >
                      <FontAwesomeIcon className="btn-icono" icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-listado"
                      onClick={() => confirmDeleteOrder(order._id!)}
                    >
                      <FontAwesomeIcon className="btn-icono" icon={faTrash} />
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
          onClick={() => setPage((prev) => prev + 1)}
          disabled={filteredOrders.length < limit}
        >
          {t("siguiente")}
        </button>
      </div>
    </div>
  );
};

export default OrderList;
