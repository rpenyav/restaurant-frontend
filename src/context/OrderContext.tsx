import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import axios from "../api/axios";

import { Comida } from "../interfaces/comida";
import { Sala } from "../interfaces/sala";
import { Order } from "../interfaces/order";

interface OrderContextType {
  orders: Order[];
  error: string | null;
  fetchOrders: (page: number, limit: number) => void;
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Promise<Order | null>;
  updateOrder: (order: Order) => void;
  changeOrderState: (id: string, newState: string) => void;
  deleteOrder: (id: string) => void;
  clearError: () => void;
  salas: Sala[];
  comidas: Comida[];
  fetchSalas: () => void;
  fetchComidas: () => void;
}

interface OrderProviderProps {
  children: ReactNode;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [comidas, setComidas] = useState<Comida[]>([]);

  const fetchOrders = useCallback(async (page: number, limit: number) => {
    try {
      const response = await axios.get(`/pedidos?page=${page}&limit=${limit}`);
      setOrders(response.data.data);
      setError(null);
    } catch (error) {
      setError("Error fetching orders");
    }
  }, []);

  const addOrder = async (order: Order) => {
    try {
      const response = await axios.post("/pedidos", order);
      setOrders([...orders, response.data]);
      setError(null);
    } catch (error: any) {
      setError(
        `Error adding order: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const response = await axios.get(`/pedidos/${id}`);
      setError(null);
      return response.data;
    } catch (error: any) {
      setError(
        `Error fetching order: ${
          error.response?.data?.message || error.message
        }`
      );
      return null;
    }
  };

  const updateOrder = async (order: Order) => {
    if (order.estado === "closed") return;
    try {
      const response = await axios.put(`/pedidos/${order._id}`, order);
      setOrders(orders.map((o) => (o._id === order._id ? response.data : o)));
      setError(null);
    } catch (error: any) {
      setError(
        `Error updating order: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const changeOrderState = async (id: string, newState: string) => {
    try {
      const response = await axios.put(`/pedidos/${id}`, { estado: newState });
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, estado: newState } : order
        )
      );
      setError(null);
    } catch (error: any) {
      setError(
        `Error changing order state: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await axios.delete(`/pedidos/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
      setError(null);
    } catch (error: any) {
      setError(
        `Error deleting order: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const clearError = () => {
    setError(null);
  };

  const fetchSalas = async () => {
    try {
      const response = await axios.get("/salas");
      setSalas(response.data.data);
    } catch (error) {
      console.error("Error fetching salas:", error);
    }
  };

  const fetchComidas = async () => {
    try {
      const response = await axios.get("/comidas");
      setComidas(response.data.data);
    } catch (error) {
      console.error("Error fetching comidas:", error);
    }
  };

  useEffect(() => {
    fetchSalas();
    fetchComidas();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        error,
        fetchOrders,
        addOrder,
        getOrderById,
        updateOrder,
        changeOrderState,
        deleteOrder,
        clearError,
        salas,
        comidas,
        fetchSalas,
        fetchComidas,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
