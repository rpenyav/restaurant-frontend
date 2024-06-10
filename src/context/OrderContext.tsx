import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "../api/axios";

interface Plato {
  _id: string;
  nombre: string;
  tipo: string;
}

interface Mesa {
  _id: string;
  numero: number;
  capacidad: number;
}

interface Sala {
  _id: string;
  nombre: string;
  mesas: Mesa[];
}

interface Comida {
  _id: string;
  tipo: string;
  platos: Plato[];
}

interface Order {
  _id?: string;
  mesa_id: string;
  estado: string;
  platos: { plato_id: string; cantidad: number }[];
  total: number;
  impuesto: number;
  propina: number;
  total_con_impuesto_y_propina: number;
  camarero_id: string;
  fecha: string;
}

interface OrderContextType {
  orders: Order[];
  error: string | null;
  fetchOrders: (page: number, limit: number) => void;
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Promise<Order | null>;
  updateOrder: (order: Order) => void;
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

  const fetchOrders = async (page: number, limit: number) => {
    try {
      const response = await axios.get(`/pedidos?page=${page}&limit=${limit}`);
      setOrders(response.data.data);
      setError(null);
    } catch (error) {
      setError("Error fetching orders");
    }
  };

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
