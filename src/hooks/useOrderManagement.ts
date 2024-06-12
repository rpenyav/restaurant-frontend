import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { Order } from "../interfaces/order";
import useOrderInfo from "../hooks/useOrderInfo";
import useCamareroInfo from "../hooks/useCamareroInfo";
import axios from "../api/axios";
import { useTranslation } from "react-i18next";
import useAlert from "../hooks/useAlert";

const useOrderManagement = (orderId: string | undefined) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    getOrderById,
    updateOrder,
    error,
    clearError,
    comidas,
    changeOrderState,
  } = useOrders();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [order, setOrder] = useState<Order | null>(null);
  const [platosSeleccionados, setPlatosSeleccionados] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isFacturado, setIsFacturado] = useState(false);
  const [isLoadingFacturar, setIsLoadingFacturar] = useState(false);
  const [wait] = useState(false);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        const fetchedOrder = await getOrderById(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
          setPlatosSeleccionados(fetchedOrder.platos);
          checkIfFacturado(fetchedOrder._id ?? "");
        }
      };
      fetchOrder();
    }
  }, [orderId, getOrderById]);

  const checkIfFacturado = async (orderId: string) => {
    try {
      const response = await axios.get("/facturas");
      const facturas = response.data.data;
      const isFacturado = facturas.some(
        (factura: any) => factura.identificador_pedido === orderId
      );
      setIsFacturado(isFacturado);
    } catch (error) {
      console.error("Error checking if order is facturado:", error);
    }
  };

  const calculateTotal = () => {
    let totalSum = 0;
    if (comidas) {
      platosSeleccionados.forEach((plato) => {
        const foundPlato = comidas
          .flatMap((comida) => comida.platos)
          .find((p) => p._id === plato.plato_id);
        if (foundPlato) {
          totalSum += foundPlato.precio * (plato.cantidad || 0);
        }
      });
    }
    setTotal(totalSum);
  };

  useEffect(() => {
    calculateTotal();
  }, [platosSeleccionados, comidas]);

  const handleUpdateOrder = async () => {
    if (order) {
      const updatedOrder = {
        ...order,
        platos: platosSeleccionados,
        camarero_id: user?._id ?? order.camarero_id,
      };
      updateOrder(updatedOrder);
      showAlert(
        "success",
        t("swal_pedido_actualizado"),
        t("swal_success_text_pedido")
      );
    }
  };

  const handleAddPlato = () => {
    setPlatosSeleccionados([
      ...platosSeleccionados,
      {
        plato_id: "",
        cantidad: 1,
        comidaId: "",
        precio: 0,
      },
    ]);
  };

  const handleRemovePlato = (index: number) => {
    const newPlatos = platosSeleccionados.filter((_, i) => i !== index);
    setPlatosSeleccionados(newPlatos);
  };

  const handlePlatoChange = (index: number, _id: string, comidaId: string) => {
    const newPlatos = [...platosSeleccionados];

    const selectedPlato = comidas
      .flatMap((comida) => comida.platos)
      .find((p) => p._id === _id);

    if (selectedPlato) {
      newPlatos[index] = {
        ...selectedPlato,
        plato_id: _id,
        cantidad: newPlatos[index].cantidad || 1,
        comidaId: comidaId,
      };
    }
    setPlatosSeleccionados(newPlatos);
  };

  const handleIncrementCantidad = (index: number) => {
    const newPlatos = [...platosSeleccionados];
    newPlatos[index].cantidad = (newPlatos[index].cantidad || 0) + 1;
    setPlatosSeleccionados(newPlatos);
  };

  const handleDecrementCantidad = (index: number) => {
    const newPlatos = [...platosSeleccionados];
    if (newPlatos[index].cantidad && newPlatos[index].cantidad > 1) {
      newPlatos[index].cantidad -= 1;
    } else {
      newPlatos[index].cantidad = 1;
    }
    setPlatosSeleccionados(newPlatos);
  };

  const handleStateChange = async (newState: string) => {
    if (order) {
      changeOrderState(order._id!, newState);
      setOrder({ ...order, estado: newState });
    }
  };

  const handleFacturarPedido = () => {
    if (order?.estado === "closed") {
      setIsLoadingFacturar(true);
      setTimeout(() => {
        setIsLoadingFacturar(false);
        navigate(`/factura-preview/${order._id}`);
      }, 2000);
    }
  };

  const handleVerFactura = () => {
    navigate(`/factura-detail/${order?._id}`);
  };

  const isDisabled = order?.estado === "closed" || isFacturado;
  const isUpdateDisabled =
    isDisabled || platosSeleccionados.some((plato) => !plato.plato_id);

  return {
    order,
    platosSeleccionados,
    total,
    isFacturado,
    isLoadingFacturar,
    wait,
    error,
    salaInfo: useOrderInfo(order?.mesa_id ?? "").salaInfo,
    userInfo: useCamareroInfo(order?.camarero_id ?? "").userInfo,
    comidas,
    handleUpdateOrder,
    handleAddPlato,
    handleRemovePlato,
    handlePlatoChange,
    handleIncrementCantidad,
    handleDecrementCantidad,
    handleStateChange,
    handleFacturarPedido,
    handleVerFactura,
    clearError,
    isDisabled,
    isUpdateDisabled,
  };
};

export default useOrderManagement;
