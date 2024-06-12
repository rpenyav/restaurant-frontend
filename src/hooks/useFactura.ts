import { useState, useEffect } from "react";
import { useOrders } from "../context/OrderContext";
import axios from "../api/axios";
import { OrderFactura } from "../interfaces/order";
import { Factura } from "../interfaces/factura";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const useFactura = (id: string | undefined) => {
  const { t } = useTranslation();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<OrderFactura | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        const fetchedOrder = await getOrderById(id);
        if (fetchedOrder && fetchedOrder.estado === "closed") {
          setOrder(fetchedOrder as OrderFactura);
        } else {
          console.error("El pedido no está cerrado o no existe.");
        }
      }
    };

    fetchOrder();
  }, [id, getOrderById]);

  const handleConfirm = async (factura: Omit<Factura, "_id">) => {
    try {
      await axios.post("/facturas", factura);
      navigate("/orders");
    } catch (error) {
      console.error("Error creating factura:", error);
    }
  };

  return {
    order,
    handleConfirm,
  };
};

export default useFactura;
