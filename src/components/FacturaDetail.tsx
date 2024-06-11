import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { formatDate } from "../utils/dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
  const { id } = useParams<{ id: string }>(); // Aquí, id es identificador_pedido
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

  if (!factura) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Volver
      </button>
      <h2>Detalle de la Factura</h2>
      <div className="mt-3">
        <h4>Fecha: {formatDate(factura.fecha)}</h4>
        <h4>Total Facturación: {factura.facturacion_total.toFixed(2)}€</h4>
      </div>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Plato</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Suma</th>
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
        <h5>Subtotal: {factura.subtotal.toFixed(2)}€</h5>
        <h5>
          Impuesto (IVA {factura.impuesto * 100}%):{" "}
          {factura.importe_iva.toFixed(2)}€
        </h5>
        <h5>
          Propina ({factura.tipo_propina}%):{" "}
          {factura.importe_propina.toFixed(2)}€
        </h5>
        <h4>Total: {factura.total.toFixed(2)}€</h4>
      </div>
    </div>
  );
};

export default FacturaDetail;
