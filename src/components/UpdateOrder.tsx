import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { Order } from "../interfaces/order";
import useOrderInfo from "../hooks/useOrderInfo";
import useCamareroInfo from "../hooks/useCamareroInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import QuantitySelector from "./QuantitySelector";
import { formatDate } from "../utils/dateUtils";
import axios from "../api/axios";
import Spinner from "react-bootstrap/Spinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UpdateOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  const [order, setOrder] = useState<Order | null>(null);
  const [platosSeleccionados, setPlatosSeleccionados] = useState<
    Order["platos"]
  >([]);
  const [total, setTotal] = useState(0);
  const [isFacturado, setIsFacturado] = useState(false);
  const [isLoadingFacturar, setIsLoadingFacturar] = useState(false);

  const [wait, setWait] = useState(false);

  useEffect(() => {
    setWait(true);
    setTimeout(() => {
      setWait(false);
    }, 1000);
  }, [setWait]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        const fetchedOrder = await getOrderById(id);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
          setPlatosSeleccionados(fetchedOrder.platos);
          checkIfFacturado(fetchedOrder._id ?? ""); // Use nullish coalescing operator to provide a default value of an empty string if fetchedOrder._id is undefined
        }
      }
    };
    fetchOrder();
  }, [id, getOrderById]);

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

  const { salaInfo } = useOrderInfo(order?.mesa_id || "");
  const { userInfo } = useCamareroInfo(order?.camarero_id || "");

  useEffect(() => {
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

    calculateTotal();
  }, [platosSeleccionados, comidas]);

  const handleUpdateOrder = async () => {
    if (order) {
      const updatedOrder = {
        ...order,
        platos: platosSeleccionados,
        camarero_id: user?._id || order.camarero_id,
      };
      await updateOrder(updatedOrder);
      Swal.fire({
        title: "Pedido actualizado",
        text: "El pedido ha sido actualizado exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
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
      newPlatos[index].cantidad = 1; // Minimum quantity should be 1
    }
    setPlatosSeleccionados(newPlatos);
  };

  const handleStateChange = async (newState: string) => {
    if (order) {
      await changeOrderState(order._id!, newState);
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

  if (!order) {
    return <div>Loading...</div>;
  }

  const isDisabled = order.estado === "closed" || isFacturado;
  const isUpdateDisabled =
    isDisabled || platosSeleccionados.some((plato) => !plato.plato_id);

  return (
    <div className="mt-5 p-4">
      <div className="d-flex justify-content-between">
        <div>
          <h4>
            {salaInfo
              ? `${salaInfo.nombre} - Mesa ${salaInfo.numero}`
              : "Cargando..."}
            {isFacturado && (
              <span style={{ color: "red", marginLeft: "10px" }}>
                pedido cobrado
              </span>
            )}
          </h4>

          <p>{formatDate(order.fecha)}</p>
        </div>
        <div>
          <h5>
            <strong>Camarero:</strong>{" "}
            {userInfo ? `${userInfo.name} ${userInfo.surname}` : "Cargando..."}
          </h5>
        </div>
      </div>
      <div className="container mt-3">
        <div className="mb-4 d-flex justify-content-end">
          <button
            className="btn boton-anyadir greenbton"
            onClick={handleAddPlato}
            disabled={isDisabled}
          >
            <FontAwesomeIcon icon={faPlus} /> Añadir Plato
          </button>
        </div>

        {error && (
          <div style={{ color: "red" }}>
            {error}
            <button onClick={clearError}>X</button>
          </div>
        )}
        <h6>Plato</h6>
        {platosSeleccionados.map((plato, index) => (
          <div key={index} className="mb-2">
            <div className="d-flex justify-content-between">
              <select
                className="form-select maxlength-select"
                id={`platoSelect${index}`}
                value={plato.plato_id}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  const selectedComidaId =
                    selectedOption.getAttribute("data-comida-id")!;
                  handlePlatoChange(index, e.target.value, selectedComidaId);
                }}
                disabled={isDisabled}
              >
                <option value="">Seleccione un plato</option>
                {comidas.map((comida) => (
                  <optgroup key={comida._id} label={comida.tipo}>
                    {comida.platos.map((platoItem) => (
                      <option
                        key={platoItem._id}
                        value={platoItem._id}
                        data-comida-id={comida._id}
                      >
                        {platoItem.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="d-flex align-items-center">
                <QuantitySelector
                  quantity={plato.cantidad || 0}
                  onIncrement={() => handleIncrementCantidad(index)}
                  onDecrement={() => handleDecrementCantidad(index)}
                  isDisabled={isDisabled}
                />
              </div>
              <span>
                <strong>
                  {(plato.precio * (plato.cantidad || 0)).toFixed(2)}€
                </strong>
              </span>

              <button
                className="btn btn-listado"
                disabled={isDisabled}
                onClick={() => handleRemovePlato(index)}
              >
                <FontAwesomeIcon className="btn-icono" icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between">
          <div>
            <button
              onClick={handleUpdateOrder}
              disabled={isUpdateDisabled}
              className="btn boton-anyadir bluebton"
            >
              Actualizar Pedido
            </button>
            <button
              className="btn boton-anyadir greenbton ms-2 me-2"
              onClick={() =>
                handleStateChange(order.estado === "open" ? "closed" : "open")
              }
              disabled={isDisabled}
            >
              {order.estado === "open" ? "Cerrar Pedido" : "Reabrir Pedido"}
            </button>
            {!wait ? (
              <button
                className="btn boton-anyadir greenbton"
                onClick={handleFacturarPedido}
                disabled={
                  order.estado !== "closed" || isFacturado || isLoadingFacturar
                }
              >
                Facturar Pedido
              </button>
            ) : (
              <Skeleton />
            )}
            {isFacturado && user?.role === "admin" && (
              <button
                className="btn boton-anyadir bluebton ms-2"
                onClick={handleVerFactura}
              >
                Ver Factura
              </button>
            )}
          </div>

          <div>
            <h5>Total: {total.toFixed(2)}€</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
