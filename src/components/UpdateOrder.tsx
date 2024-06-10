import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

const UpdateOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, updateOrder, error, clearError, salas, comidas } =
    useOrders();

  const [order, setOrder] = useState<any>(null);
  const [platosSeleccionados, setPlatosSeleccionados] = useState([
    { plato_id: "", cantidad: 1 },
  ]);

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

  const handleUpdateOrder = () => {
    if (order) {
      const updatedOrder = {
        ...order,
        platos: platosSeleccionados,
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

  if (!order) {
    return <div>Loading...</div>;
  }

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
            onChange={(e) => {
              const newPlatos = [...platosSeleccionados];
              newPlatos[index].plato_id = e.target.value;
              setPlatosSeleccionados(newPlatos);
            }}
          >
            <option value="">Seleccione un plato</option>
            {comidas.map((comida) => (
              <optgroup key={comida._id} label={comida.tipo}>
                {comida.platos.map((plato) => (
                  <option key={plato._id} value={plato._id}>
                    {plato.nombre}
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
          />
          <button onClick={() => handleRemovePlato(index)}>Eliminar</button>
        </div>
      ))}
      <button onClick={handleAddPlato}>Añadir Plato</button>
      <button onClick={handleUpdateOrder}>Actualizar Pedido</button>
    </div>
  );
};

export default UpdateOrder;
