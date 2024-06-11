import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useOrders } from "../context/OrderContext";
import { Plato } from "../interfaces/plato";
import { OrderToCreate } from "../interfaces/order";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QuantitySelector from "./QuantitySelector";

interface OrderFormProps {
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onClose }) => {
  const { userId } = useUser();
  const { addOrder, salas, comidas, error, clearError } = useOrders();

  const [mesaId, setMesaId] = useState("");
  const [platosSeleccionados, setPlatosSeleccionados] = useState<Plato[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      let totalSum = 0;
      if (comidas) {
        platosSeleccionados.forEach((plato) => {
          const foundPlato = comidas
            .flatMap((comida) => comida.platos)
            .find((p) => p._id === plato._id);
          if (foundPlato) {
            totalSum += foundPlato.precio * (plato.cantidad ?? 0);
          }
        });
      }
      setTotal(totalSum);
    };

    calculateTotal();
  }, [platosSeleccionados, comidas]);

  const handleAddOrder = () => {
    const validPlatos = platosSeleccionados
      .filter((plato) => plato._id && (plato.cantidad ?? 0) > 0)
      .map((plato) => ({
        plato_id: plato._id,
        comidaId: plato.comidaId,
        cantidad: plato.cantidad ?? 0,
      }));

    const order: OrderToCreate = {
      mesa_id: mesaId,
      estado: "open",
      platos: validPlatos,
      total: 0,
      impuesto: 0,
      propina: 0,
      total_con_impuesto_y_propina: 0,
      camarero_id: userId!,
      fecha: new Date().toISOString(),
    };

    addOrder(order);
    onClose();
  };

  const handleAddPlato = () => {
    setPlatosSeleccionados([
      ...platosSeleccionados,
      {
        _id: "",
        nombre: "",
        stock: 0,
        descripcion: "",
        precio: 0,
        ingredientes: [],
        disponibilidad: false,
        particularidades_alimentarias: {
          celiaco: false,
          alergenos: [],
          _id: "",
        },
        comidaId: "",
        cantidad: 1,
      },
    ]);
  };

  const handleRemovePlato = (index: number) => {
    const newPlatos = platosSeleccionados.filter((_, i) => i !== index);
    setPlatosSeleccionados(newPlatos);
  };

  const handlePlatoChange = (index: number, plato_id: string) => {
    const foundPlato = comidas
      .flatMap((comida) => comida.platos)
      .find((p) => p._id === plato_id);

    if (foundPlato) {
      const updatedPlatos = platosSeleccionados.map((plato, i) =>
        i === index ? { ...foundPlato, cantidad: plato.cantidad } : plato
      );
      setPlatosSeleccionados(updatedPlatos);
    }
  };

  const handleIncrementCantidad = (index: number) => {
    const newPlatos = [...platosSeleccionados];
    if (newPlatos[index]) {
      newPlatos[index].cantidad = (newPlatos[index].cantidad || 0) + 1;
      setPlatosSeleccionados(newPlatos);
    }
  };

  const handleDecrementCantidad = (index: number) => {
    const newPlatos = [...platosSeleccionados];
    if (
      newPlatos[index] &&
      newPlatos[index].cantidad &&
      newPlatos[index].cantidad! > 1
    ) {
      newPlatos[index].cantidad! -= 1;
    } else if (newPlatos[index]) {
      newPlatos[index].cantidad = 1; // Minimum quantity should be 1
    }
    setPlatosSeleccionados(newPlatos);
  };

  const isAddOrderDisabled = platosSeleccionados.some((plato) => !plato._id);
  console.log("userId", userId);
  return (
    <div>
      {error && (
        <div style={{ color: "red" }}>
          {error}
          <button onClick={clearError}>X</button>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="mesaSelect">Mesa</label>
        <select
          id="mesaSelect"
          className="form-select"
          value={mesaId}
          onChange={(e) => setMesaId(e.target.value)}
        >
          <option value="">Seleccione una mesa</option>
          {salas.map((sala) => (
            <optgroup key={sala._id} label={sala.nombre}>
              {sala.mesas.map((mesa) => (
                <option key={mesa._id} value={mesa._id}>
                  Mesa {mesa.numero} (Capacidad: {mesa.capacidad})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="d-flex justify-content-center mb-3">
        <button className="btn boton-anyadir bluebton" onClick={handleAddPlato}>
          Añadir Plato
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
            <option value="">Seleccione un plato</option>
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
          <strong>Total:</strong> {total.toFixed(2)}
        </div>
        <button
          className="btn boton-anyadir greenbton"
          onClick={handleAddOrder}
          disabled={isAddOrderDisabled}
        >
          Crear Pedido
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
