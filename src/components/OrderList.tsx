import React, { useState, useEffect } from "react";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

const OrderList: React.FC = () => {
  const {
    fetchOrders,
    orders,
    error,
    clearError,
    changeOrderState,
    deleteOrder,
  } = useOrders();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchOrders(page, limit);
  }, [page, limit, fetchOrders]);

  const handleStateChange = (id: string, newState: string) => {
    changeOrderState(id, newState);
  };

  const handleDeleteOrder = (id: string) => {
    deleteOrder(id);
  };

  return (
    <div>
      <h2>Pedidos</h2>
      {error && (
        <div style={{ color: "red" }}>
          {error}
          <button onClick={clearError}>X</button>
        </div>
      )}
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
                {order.estado === "open" ? (
                  <button
                    onClick={() => handleStateChange(order._id!, "closed")}
                  >
                    Cerrar
                  </button>
                ) : (
                  <button onClick={() => handleStateChange(order._id!, "open")}>
                    Reabrir
                  </button>
                )}
                <button onClick={() => navigate(`/update-order/${order._id}`)}>
                  Actualizar
                </button>
                <button onClick={() => handleDeleteOrder(order._id!)}>
                  Eliminar
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

export default OrderList;
