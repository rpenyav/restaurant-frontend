// src/services/searchService.ts
import axios from "../api/axios";
import { Order } from "../interfaces/order";

export const searchOrders = async (query: string): Promise<Order[]> => {
  const response = await axios.get(`/pedidos/search?query=${query}`);
  return response.data;
};
