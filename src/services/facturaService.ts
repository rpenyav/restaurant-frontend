import axios from "../api/axios";
import { Factura } from "../interfaces/factura";

export const getFacturaByPedidoId = async (
  pedidoId: string
): Promise<Factura> => {
  const response = await axios.get(`/facturas/pedido/${pedidoId}`);
  return response.data;
};

export const fetchFacturas = async (
  page: number,
  limit: number
): Promise<any> => {
  const response = await axios.get(`/facturas?page=${page}&limit=${limit}`);
  return response.data;
};
