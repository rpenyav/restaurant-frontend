import React, { useState, useEffect } from "react";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { fetchSalaByMesaId } from "../services/salaService";
import { fetchUserById } from "../services/userService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { formatDateToDDMMYYYY } from "../utils/dateUtils";
import BuscadorPedidos from "./BuscadorPedidos";
import axios from "../api/axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";

const OrderList: React.FC = () => {
  const {
    fetchOrders,
    orders,
    error,
    clearError,
    changeOrderState,
    deleteOrder,
  } = useOrders();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filteredOrders, setFilteredOrders] = useState(orders);
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
        await fetchOrders(page, limit);
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
        // setLoading(true);
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
    } else {
      // setLoading(false);
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
    Swal.fire({
      title: t("swal_estas_seguro"),
      text: t("swal_no_revertir"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("swal_si_eliminar"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder(id);
        Swal.fire(
          t("swal_eliminado"),
          t("swal_pedido_ha_sido_eliminado"),
          "success"
        );
      }
    });
  };

  const handleSearch = async (searchTerm: string) => {
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

  return (
    <div>
      <div className="d-flex justify-content-between mb-5">
        <h2>{t("pedidos")}</h2>
        <BuscadorPedidos onSearch={handleSearch} />
      </div>
      {error && (
        <div style={{ color: "red" }}>
          {error}
          <button onClick={clearError}>X</button>
        </div>
      )}
      <table className="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th>{t("mesa")}</th>
            <th>{t("estado")}</th>
            <th>{t("bartender")}</th>
            <th>{t("fecha")}</th>
            <th>{t("acciones")}</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: limit }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton width={100} height={40} />
                  </td>
                </tr>
              ))
            : filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {salaInfo[order.mesa_id]
                      ? `${salaInfo[order.mesa_id].nombre} - ${t("mesa")} ${
                          salaInfo[order.mesa_id].numero
                        }`
                      : order.mesa_id}
                  </td>
                  <td>
                    {facturados.has(order._id!) ? t("facturado") : order.estado}
                  </td>
                  <td>
                    {userInfo[order.camarero_id]
                      ? `${userInfo[order.camarero_id].name} ${
                          userInfo[order.camarero_id].surname
                        }`
                      : order.camarero_id}
                  </td>
                  <td>{formatDateToDDMMYYYY(order.fecha)}</td>
                  <td className="text-center" width={"10%"}>
                    {order.estado === "open" ? (
                      <button
                        className="btn btn-listado bgstatus-green"
                        onClick={() => handleStateChange(order._id!, "closed")}
                        disabled={facturados.has(order._id!)}
                      >
                        <FontAwesomeIcon className="btn-icono" icon={faCheck} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-listado bgstatus-red"
                        onClick={() => handleStateChange(order._id!, "open")}
                        disabled={facturados.has(order._id!)}
                      >
                        <FontAwesomeIcon className="btn-icono" icon={faTimes} />
                      </button>
                    )}
                    <button
                      className="btn btn-listado"
                      onClick={() => navigate(`/update-order/${order._id}`)}
                    >
                      <FontAwesomeIcon className="btn-icono" icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-listado"
                      onClick={() => handleDeleteOrder(order._id!)}
                    >
                      <FontAwesomeIcon className="btn-icono" icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          {t("anterior")}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={orders.length < limit}
        >
          {t("siguiente")}
        </button>
      </div>
    </div>
  );
};

export default OrderList;
