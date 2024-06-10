import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";

interface Plato {
  plato_id: string;
  cantidad: number;
}

interface Order {
  _id?: string;
  mesa_id: string;
  estado: string;
  platos: Plato[];
  total: number;
  impuesto: number;
  propina: number;
  total_con_impuesto_y_propina: number;
  camarero_id: string;
  fecha: string;
}

const UpdateOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const {
    getOrderById,
    updateOrder,
    error,
    clearError,
    salas,
    comidas,
    changeOrderState,
  } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [platosSeleccionados, setPlatosSeleccionados] = useState<Plato[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        const fetchedOrder = await getOrderById(id);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
          setPlatosSeleccionados(fetchedOrder.platos);
        }
      }
    };
    fetchOrder();
  }, [id, getOrderById]);

  useEffect(() => {
    const calculateTotal = () => {
      let totalSum = 0;
      if (comidas) {
        platosSeleccionados.forEach((plato) => {
          const foundPlato = comidas
            .flatMap((comida) => comida.platos)
            .find((p) => p._id === plato.plato_id);
          if (foundPlato) {
            totalSum += foundPlato.precio * plato.cantidad;
          }
        });
      }
      setTotal(totalSum);
    };

    calculateTotal();
  }, [platosSeleccionados, comidas]);

  const handleUpdateOrder = () => {
    if (order) {
      const updatedOrder = {
        ...order,
        platos: platosSeleccionados,
        camarero_id: user?._id || order.camarero_id, // Asegurar que camarero_id está presente
      };
      updateOrder(updatedOrder);
    }
  };

  const handleAddPlato = () => {
    setPlatosSeleccionados([
      ...platosSeleccionados,
      { plato_id: "", cantidad: 1 },
    ]);
  };

  const handleRemovePlato = (index: number) => {
    const newPlatos = platosSeleccionados.filter((_, i) => i !== index);
    setPlatosSeleccionados(newPlatos);
  };

  const handlePlatoChange = (index: number, plato_id: string) => {
    const existingPlato = platosSeleccionados.find(
      (plato) => plato.plato_id === plato_id
    );

    if (existingPlato) {
      const updatedPlatos = platosSeleccionados.map((plato) =>
        plato.plato_id === plato_id
          ? { ...plato, cantidad: plato.cantidad + 1 }
          : plato
      );
      setPlatosSeleccionados(updatedPlatos);
    } else {
      const newPlatos = [...platosSeleccionados];
      newPlatos[index].plato_id = plato_id;
      setPlatosSeleccionados(newPlatos);
    }
  };

  const handleStateChange = async (newState: string) => {
    if (order) {
      await changeOrderState(order._id!, newState);
      setOrder({ ...order, estado: newState });
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  const isDisabled = order.estado === "closed";

  return (
    <div>
      <h2>Actualizar Pedido</h2>
      {error && (
        <div style={{ color: "red" }}>
          {error}
          <button onClick={clearError}>X</button>
        </div>
      )}
      <div>
        <strong>Mesa:</strong> {order.mesa_id}
      </div>
      {platosSeleccionados.map((plato, index) => (
        <div key={index}>
          <label htmlFor={`platoSelect${index}`}>Plato</label>
          <select
            id={`platoSelect${index}`}
            value={plato.plato_id}
            onChange={(e) => handlePlatoChange(index, e.target.value)}
            disabled={isDisabled}
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
          <input
            type="number"
            placeholder="Cantidad"
            value={plato.cantidad}
            onChange={(e) => {
              const newPlatos = [...platosSeleccionados];
              newPlatos[index].cantidad = Number(e.target.value);
              setPlatosSeleccionados(newPlatos);
            }}
            disabled={isDisabled}
          />
          <span>
            {comidas
              ? (comidas
                  .flatMap((comida) => comida.platos)
                  .find((p) => p._id === plato.plato_id)?.precio ?? 0) *
                  plato.cantidad || 0
              : 0}
          </span>
          <button
            onClick={() => handleRemovePlato(index)}
            disabled={isDisabled}
          >
            Eliminar
          </button>
        </div>
      ))}
      <button onClick={handleAddPlato} disabled={isDisabled}>
        Añadir Plato
      </button>
      <div>
        <strong>Total:</strong> {total.toFixed(2)}
      </div>
      <button onClick={handleUpdateOrder} disabled={isDisabled}>
        Actualizar Pedido
      </button>
      <button
        onClick={() =>
          handleStateChange(order.estado === "open" ? "closed" : "open")
        }
      >
        {order.estado === "open" ? "Cerrar Pedido" : "Reabrir Pedido"}
      </button>
    </div>
  );
};

export default UpdateOrder;
