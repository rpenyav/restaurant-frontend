import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { Order } from "../interfaces/order";

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
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [platosSeleccionados, setPlatosSeleccionados] = useState<
    Order["platos"]
  >([]);
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
            .find((p) => p._id === plato._id);
          if (foundPlato) {
            totalSum += foundPlato.precio * (plato.cantidad || 0);
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
        camarero_id: user?._id || order.camarero_id,
      };
      updateOrder(updatedOrder);
    }
  };

  const handleAddPlato = () => {
    setPlatosSeleccionados([
      ...platosSeleccionados,
      {
        _id: "",
        cantidad: 1,
        comidaId: "",
        nombre: "",
        stock: 0,
        precio: 0,
        ingredientes: [],
        disponibilidad: false,
        particularidades_alimentarias: {
          celiaco: false,
          alergenos: [],
          _id: "",
        },
      },
    ]);
  };

  const handleRemovePlato = (index: number) => {
    const newPlatos = platosSeleccionados.filter((_, i) => i !== index);
    setPlatosSeleccionados(newPlatos);
  };

  const handlePlatoChange = (index: number, _id: string, comidaId: string) => {
    const newPlatos = [...platosSeleccionados];
    const selectedPlato = comidas
      .flatMap((comida) => comida.platos)
      .find((p) => p._id === _id);

    if (selectedPlato) {
      newPlatos[index] = {
        ...selectedPlato,
        cantidad: newPlatos[index].cantidad || 1,
      };
    }
    setPlatosSeleccionados(newPlatos);
  };

  const handleCantidadChange = (index: number, cantidad: number) => {
    const newPlatos = [...platosSeleccionados];
    newPlatos[index].cantidad = cantidad;
    setPlatosSeleccionados(newPlatos);
  };

  const handleStateChange = async (newState: string) => {
    if (order) {
      await changeOrderState(order._id!, newState);
      setOrder({ ...order, estado: newState });
    }
  };

  const handleFacturarPedido = () => {
    if (order?.estado === "closed") {
      navigate(`/factura-preview/${order._id}`);
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
            value={plato._id}
            onChange={(e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              const selectedComidaId =
                selectedOption.getAttribute("data-comida-id")!;
              handlePlatoChange(index, e.target.value, selectedComidaId);
            }}
            disabled={isDisabled}
          >
            <option value="">Seleccione un plato</option>
            {comidas.map((comida) => (
              <optgroup key={comida._id} label={comida.tipo}>
                {comida.platos.map((platoItem) => (
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
          <input
            type="number"
            placeholder="Cantidad"
            value={plato.cantidad || 0}
            onChange={(e) =>
              handleCantidadChange(index, Number(e.target.value))
            }
            disabled={isDisabled}
          />
          <span>{plato.precio * (plato.cantidad || 0)}</span>
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
      <button
        onClick={handleFacturarPedido}
        disabled={order.estado !== "closed"}
      >
        Facturar Pedido
      </button>
    </div>
  );
};

export default UpdateOrder;
