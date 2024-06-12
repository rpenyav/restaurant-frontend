import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import QuantitySelector from "./QuantitySelector";
import { useTranslation } from "react-i18next";
import useOrderForm from "../hooks/useOrderForm";

interface OrderFormProps {
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const {
    mesaId,
    setMesaId,
    platosSeleccionados,
    total,
    error,
    clearError,
    salas,
    comidas,
    handleAddOrder,
    handleAddPlato,
    handleRemovePlato,
    handlePlatoChange,
    handleIncrementCantidad,
    handleDecrementCantidad,
    isAddOrderDisabled,
  } = useOrderForm();

  const handleSubmit = () => {
    handleAddOrder();
    onClose();
  };

  return (
    <div>
      {error && (
        <div style={{ color: "red" }}>
          {error}
          <button onClick={clearError}>X</button>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="mesaSelect">{t("mesa")}</label>
        <select
          id="mesaSelect"
          className="form-select"
          value={mesaId}
          onChange={(e) => setMesaId(e.target.value)}
        >
          <option value="">{t("seleccione_una_mesa")}</option>
          {salas.map((sala) => (
            <optgroup key={sala._id} label={sala.nombre}>
              {sala.mesas.map((mesa) => (
                <option key={mesa._id} value={mesa._id}>
                  {t("mesa")} {mesa.numero} ({t("capacidad")}: {mesa.capacidad})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="d-flex justify-content-center mb-3">
        <button className="btn boton-anyadir bluebton" onClick={handleAddPlato}>
          {t("add_plato")}
        </button>
      </div>

      {platosSeleccionados.map((plato, index) => (
        <div key={index} className="d-flex justify-content-between">
          <select
            className="form-select maxlength-select me-2 mb-2"
            id={`platoSelect${index}`}
            value={plato._id}
            onChange={(e) => handlePlatoChange(index, e.target.value)}
          >
            <option value="">{t("seleccione_plato")}</option>
            {comidas.map((comida) => (
              <optgroup key={comida._id} label={comida.tipo}>
                {comida.platos.map((platoItem) => (
                  <option key={platoItem._id} value={platoItem._id}>
                    {platoItem.nombre}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <QuantitySelector
            quantity={plato.cantidad || 0}
            onIncrement={() => handleIncrementCantidad(index)}
            onDecrement={() => handleDecrementCantidad(index)}
          />
          <div className="ms-2 me-3">
            <span>
              <strong>
                {(plato.precio * (plato.cantidad ?? 0)).toFixed(2)}€
              </strong>
            </span>
          </div>
          <button
            className="btn boton-anyadir redbton"
            onClick={() => handleRemovePlato(index)}
          >
            <FontAwesomeIcon className="btn-icono" icon={faTrash} />
          </button>
        </div>
      ))}

      <div className="d-flex justify-content-between mt-4">
        <div>
          <strong>{t("total")}:</strong> {total.toFixed(2)}
        </div>
        <button
          className="btn boton-anyadir greenbton"
          onClick={handleSubmit}
          disabled={isAddOrderDisabled}
        >
          {t("crear_pedido")}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
