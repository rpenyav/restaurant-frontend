import axios from "../api/axios";
import { FacturaSearch } from "../interfaces/factura";
import { Order } from "../interfaces/order";

interface SearchFilters {
  searchTerm: string;
  date: string;
  amount: number;
}

export const searchOrders = async (query: string): Promise<Order[]> => {
  const response = await axios.get(`/pedidos/search?query=${query}`);
  return response.data;
};

export const searchFacturas = async (
  filters: SearchFilters
): Promise<FacturaSearch[]> => {
  const response = await axios.get(`/facturas/search`, { params: filters });
  return response.data;
};
