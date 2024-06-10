import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

const OrderForm: React.FC = () => {
  const { userId } = useUser();
  const { addOrder, fetchOrders, orders, error, clearError, salas, comidas } =
    useOrders();
  const navigate = useNavigate();

  const [mesaId, setMesaId] = useState("");
  const [platosSeleccionados, setPlatosSeleccionados] = useState([
    { plato_id: "", cantidad: 1 },
  ]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchOrders(page, limit);
  }, [page, limit, fetchOrders]);

  const handleAddOrder = () => {
    const order = {
      mesa_id: mesaId,
      estado: "open",
      platos: platosSeleccionados,
      total: 0,
      impuesto: 0,
      propina: 0,
      total_con_impuesto_y_propina: 0,
      camarero_id: userId,
      fecha: new Date().toISOString(),
    };

    addOrder(order);
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

  return (
    <div>
      <h2>Nuevo Pedido</h2>
      {error && (
        <div style={{ color: "red" }}>
          {error}
          <button onClick={clearError}>X</button>
        </div>
      )}
      <label htmlFor="mesaSelect">Mesa</label>
      <select
        id="mesaSelect"
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
      <button onClick={handleAddOrder}>Crear Pedido</button>
      <h2>Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>Mesa</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.mesa_id}</td>
              <td>{order.estado}</td>
              <td>
                <button onClick={() => navigate(`/update-order/${order._id}`)}>
                  Actualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={orders.length < limit}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
