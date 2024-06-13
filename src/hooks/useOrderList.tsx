import { useState, useEffect } from "react";
import { useOrders } from "../context/OrderContext";
import { fetchSalaByMesaId } from "../services/salaService";
import { fetchUserById } from "../services/userService";
import axios from "../api/axios";
import { Order } from "../interfaces/order";
import { formatDateToDDMMYYYY } from "src/utils/dateUtils";

const useOrderList = () => {
  const {
    fetchOrders,
    orders,
    error,
    clearError,
    changeOrderState,
    deleteOrder,
  } = useOrders();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [salaInfo, setSalaInfo] = useState<{
    [key: string]: { nombre: string; numero: number };
  }>({});
  const [userInfo, setUserInfo] = useState<{
    [key: string]: { name: string; surname: string };
  }>({});
  const [facturados, setFacturados] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        fetchOrders(page, limit);
        await fetchFacturas();
        await fetchSalaInfo();
        await fetchUserInfo();
        setFilteredOrders(orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, [page, limit, fetchOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      const fetchAdditionalData = async () => {
        try {
          await fetchFacturas();
          await fetchSalaInfo();
          await fetchUserInfo();
          setFilteredOrders(orders);
        } catch (error) {
          console.error("Error fetching additional data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAdditionalData();
    }
  }, [orders]);

  const fetchFacturas = async () => {
    try {
      const response = await axios.get("/facturas");
      const facturas = response.data.data;
      const facturadosSet: Set<string> = new Set(
        facturas.map((factura: any) => factura.identificador_pedido)
      );
      setFacturados(facturadosSet);
    } catch (error) {
      console.error("Error fetching facturas:", error);
    }
  };

  const fetchSalaInfo = async () => {
    const salaInfoMap: { [key: string]: { nombre: string; numero: number } } =
      {};
    for (const order of orders) {
      if (!salaInfo[order.mesa_id]) {
        try {
          const { sala, mesa } = await fetchSalaByMesaId(order.mesa_id);
          salaInfoMap[order.mesa_id] = {
            nombre: sala.nombre,
            numero: mesa.numero,
          };
        } catch (error) {
          console.error(
            `Error fetching sala for mesa_id ${order.mesa_id}:`,
            error
          );
        }
      }
    }
    setSalaInfo((prev) => ({ ...prev, ...salaInfoMap }));
  };

  const fetchUserInfo = async () => {
    const userInfoMap: { [key: string]: { name: string; surname: string } } =
      {};
    for (const order of orders) {
      if (!userInfo[order.camarero_id]) {
        try {
          const user = await fetchUserById(order.camarero_id);
          userInfoMap[order.camarero_id] = {
            name: user.name,
            surname: user.surname,
          };
        } catch (error) {
          console.error(
            `Error fetching user for camarero_id ${order.camarero_id}:`,
            error
          );
        }
      }
    }
    setUserInfo((prev) => ({ ...prev, ...userInfoMap }));
  };

  const handleStateChange = (id: string, newState: string) => {
    changeOrderState(id, newState);
  };

  const handleDeleteOrder = (id: string) => {
    deleteOrder(id);
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        const mesa = salaInfo[order.mesa_id]
          ? `${salaInfo[order.mesa_id].nombre} - Mesa ${
              salaInfo[order.mesa_id].numero
            }`
          : order.mesa_id;
        const camarero = userInfo[order.camarero_id]
          ? `${userInfo[order.camarero_id].name} ${
              userInfo[order.camarero_id].surname
            }`
          : order.camarero_id;
        const fecha = formatDateToDDMMYYYY(order.fecha);

        return (
          mesa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
          camarero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fecha.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredOrders(filtered);
    }
  };

  return {
    page,
    setPage,
    limit,
    filteredOrders,
    loading,
    error,
    clearError,
    salaInfo,
    userInfo,
    facturados,
    handleStateChange,
    handleDeleteOrder,
    handleSearch,
  };
};

export default useOrderList;
