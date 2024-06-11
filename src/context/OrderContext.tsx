import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import {
  fetchOrders as fetchOrdersService,
  addOrder as addOrderService,
  getOrderById as getOrderByIdService,
  updateOrder as updateOrderService,
  changeOrderState as changeOrderStateService,
  deleteOrder as deleteOrderService,
  fetchSalas as fetchSalasService,
  fetchComidas as fetchComidasService,
} from "../services/orderService";
import { Comida } from "../interfaces/comida";
import { Sala } from "../interfaces/sala";
import { Order, OrderToCreate } from "../interfaces/order";

interface OrderContextType {
  orders: Order[];
  error: string | null;
  fetchOrders: (page: number, limit: number) => void;
  addOrder: (order: OrderToCreate) => void;
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
      const data = await fetchOrdersService(page, limit);
      setOrders(data);
      setError(null);
    } catch (error) {
      setError("Error fetching orders");
    }
  }, []);

  const addOrder = async (order: OrderToCreate) => {
    try {
      const newOrder = await addOrderService(order);
      setOrders([...orders, newOrder]);
      setError(null);
    } catch (error: any) {
      setError(
        `Error adding order: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const order = await getOrderByIdService(id);
      setError(null);
      return order;
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
      const updatedOrder = await updateOrderService(order);
      setOrders(orders.map((o) => (o._id === order._id ? updatedOrder : o)));
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
      const updatedOrder = await changeOrderStateService(id, newState);
      setOrders(
        orders.map((order) => (order._id === id ? updatedOrder : order))
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
      await deleteOrderService(id);
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
      const data = await fetchSalasService();
      setSalas(data);
    } catch (error) {
      console.error("Error fetching salas:", error);
    }
  };

  const fetchComidas = async () => {
    try {
      const data = await fetchComidasService();
      setComidas(data);
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
