import axios from "../api/axios";
import { Order, OrderToCreate } from "../interfaces/order";

export const fetchOrders = async (page: number, limit: number) => {
  const response = await axios.get(`/pedidos?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const addOrder = async (order: OrderToCreate) => {
  const response = await axios.post("/pedidos", order);
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const response = await axios.get(`/pedidos/${id}`);
  return response.data;
};

export const updateOrder = async (order: Order) => {
  const response = await axios.put(`/pedidos/${order._id}`, order);
  return response.data;
};

export const changeOrderState = async (id: string, newState: string) => {
  const response = await axios.put(`/pedidos/${id}`, { estado: newState });
  return response.data;
};

export const deleteOrder = async (id: string) => {
  await axios.delete(`/pedidos/${id}`);
};

export const fetchSalas = async () => {
  const response = await axios.get("/salas");
  return response.data.data;
};

export const fetchComidas = async () => {
  const response = await axios.get("/comidas");
  return response.data.data;
};
