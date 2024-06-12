import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { formatDate } from "../utils/dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LoaderComponent from "./LoaderComponent";
import { useTranslation } from "react-i18next";

interface Factura {
  _id: string;
  fecha: string;
  facturacion_total: number;
  desglose: {
    plato: string;
    precio: number;
    cantidad: number;
    suma: number;
  }[];
  subtotal: number;
  impuesto: number;
  importe_iva: number;
  tipo_propina: number;
  importe_propina: number;
  total: number;
  identificador_pedido: string;
}

const FacturaDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [factura, setFactura] = useState<Factura | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const response = await axios.get(`/facturas/pedido/${id}`);
        setFactura(response.data);
      } catch (error) {
        console.error("Error fetching factura:", error);
      }
    };

    fetchFactura();
  }, [id]);

  if (!factura) return <LoaderComponent />;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> {t("volver")}
      </button>
      <h2>{t("detalle_factura")}</h2>
      <div className="mt-3">
        <h4>
          {t("fecha")}: {formatDate(factura.fecha)}
        </h4>
        <h4>
          {t("total_facturacion")}: {factura.facturacion_total.toFixed(2)}€
        </h4>
      </div>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>{t("plato")}</th>
            <th>{t("precio")}</th>
            <th>{t("cantidad")}</th>
            <th>{t("suma")}</th>
          </tr>
        </thead>
        <tbody>
          {factura.desglose.map((item, index) => (
            <tr key={index}>
              <td>{item.plato}</td>
              <td>{item.precio.toFixed(2)}€</td>
              <td>{item.cantidad}</td>
              <td>{item.suma.toFixed(2)}€</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <h5>
          {t("subtotal")}: {factura.subtotal.toFixed(2)}€
        </h5>
        <h5>
          {t("impuesto")} (IVA {factura.impuesto * 100}%):{" "}
          {factura.importe_iva.toFixed(2)}€
        </h5>
        <h5>
          {t("propina")} ({factura.tipo_propina}%):{" "}
          {factura.importe_propina.toFixed(2)}€
        </h5>
        <h4>
          {t("total")}: {factura.total.toFixed(2)}€
        </h4>
      </div>
    </div>
  );
};

export default FacturaDetail;
