import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QuantitySelector from "./QuantitySelector";
import { formatDate } from "../utils/dateUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useOrderManagement from "../hooks/useOrderManagement";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comida } from "../interfaces/comida";
import { Plato } from "../interfaces/plato";
import { useAuth } from "src/context/AuthContext";

const UpdateOrder: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const {
    order,
    platosSeleccionados,
    total,
    isFacturado,
    isLoadingFacturar,
    wait,
    error,
    salaInfo,
    userInfo,
    comidas, // Asegúrate de que comidas esté disponible aquí
    handleUpdateOrder,
    handleAddPlato,
    handleRemovePlato,
    handlePlatoChange,
    handleIncrementCantidad,
    handleDecrementCantidad,
    handleStateChange,
    handleFacturarPedido,
    handleVerFactura,
    clearError,
    isDisabled,
    isUpdateDisabled,
  } = useOrderManagement(id);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-5 p-4">
      <div className="d-flex justify-content-between">
        <div>
          <h4>
            {salaInfo ? (
              `${salaInfo.nombre} - Mesa ${salaInfo.numero}`
            ) : (
              <Skeleton />
            )}
            {isFacturado && (
              <span style={{ color: "red", marginLeft: "10px" }}>
                {t("pedido_cobrado")}
              </span>
            )}
          </h4>

          <p>{formatDate(order.fecha)}</p>
        </div>
        <div>
          <h5>
            <strong>{t("bartender")}:</strong>{" "}
            {userInfo ? `${userInfo.name} ${userInfo.surname}` : <Skeleton />}
          </h5>
        </div>
      </div>
      <div className="container mt-3">
        <div className="mb-4 d-flex justify-content-end">
          <button
            className="btn boton-anyadir greenbton"
            onClick={handleAddPlato}
            disabled={isDisabled}
          >
            <FontAwesomeIcon icon={faPlus} /> {t("add_plato")}
          </button>
        </div>

        {error && (
          <div style={{ color: "red" }}>
            {error}
            <button onClick={clearError}>X</button>
          </div>
        )}
        <h6>{t("plato_title")}</h6>
        {platosSeleccionados.map((plato, index) => (
          <div key={index} className="mb-2">
            <div className="d-flex justify-content-between">
              <select
                className="form-select maxlength-select"
                id={`platoSelect${index}`}
                value={plato.plato_id}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  const selectedComidaId =
                    selectedOption.getAttribute("data-comida-id")!;
                  handlePlatoChange(index, e.target.value, selectedComidaId);
                }}
                disabled={isDisabled}
              >
                <option value="">{t("seleccione_plato")}</option>
                {comidas.map((comida: Comida) => (
                  <optgroup key={comida._id} label={comida.tipo}>
                    {comida.platos.map((platoItem: Plato) => (
                      <option
                        key={platoItem._id}
                        value={platoItem._id}
                        data-comida-id={comida._id}
                      >
                        {platoItem.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="d-flex align-items-center">
                <QuantitySelector
                  quantity={plato.cantidad || 0}
                  onIncrement={() => handleIncrementCantidad(index)}
                  onDecrement={() => handleDecrementCantidad(index)}
                  isDisabled={isDisabled}
                />
              </div>
              <span>
                <strong>
                  {(plato.precio * (plato.cantidad || 0)).toFixed(2)}€
                </strong>
              </span>

              <button
                className="btn btn-listado"
                disabled={isDisabled}
                onClick={() => handleRemovePlato(index)}
              >
                <FontAwesomeIcon className="btn-icono" icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between">
          <div>
            <button
              onClick={handleUpdateOrder}
              disabled={isUpdateDisabled}
              className="btn boton-anyadir bluebton"
            >
              {t("update_pedido")}
            </button>
            <button
              className="btn boton-anyadir greenbton ms-2 me-2"
              onClick={() =>
                handleStateChange(order.estado === "open" ? "closed" : "open")
              }
              disabled={isDisabled}
            >
              {order.estado === "open"
                ? t("cerrar_pedido")
                : t("reabrir_pedido")}
            </button>
            {!wait ? (
              <button
                className="btn boton-anyadir greenbton"
                onClick={handleFacturarPedido}
                disabled={
                  order.estado !== "closed" || isFacturado || isLoadingFacturar
                }
              >
                {t("facturar_pedido")}
              </button>
            ) : null}
            {isFacturado && user?.role === "admin" && (
              <button
                className="btn boton-anyadir bluebton ms-2"
                onClick={handleVerFactura}
              >
                {t("ver_factura")}
              </button>
            )}
          </div>

          <div>
            <h5>
              {t("total")}: {total.toFixed(2)}€
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
