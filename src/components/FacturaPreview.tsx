// components/FacturaPreview.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import axios from "../api/axios";
import { OrderFactura } from "../interfaces/order";
import { Factura } from "../interfaces/factura";

const FacturaPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<OrderFactura | null>(null);
  const [propina, setPropina] = useState<number>(10); // Propina inicial en porcentaje
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        const fetchedOrder = await getOrderById(id);
        if (fetchedOrder && fetchedOrder.estado === "closed") {
          setOrder(fetchedOrder as OrderFactura); // Update the type of fetchedOrder
        } else {
          console.error("El pedido no está cerrado o no existe.");
        }
      }
    };

    fetchOrder();
  }, [id, getOrderById]);

  if (!order) return <div>Loading...</div>;

  const subtotal = order.platos.reduce((acc, plato) => {
    return acc + plato.precio * (plato.cantidad ?? 0);
  }, 0);

  const importeIva = subtotal * 0.21;
  const importePropina = subtotal * (propina / 100);
  const total = subtotal + importeIva + importePropina;

  const handleConfirm = async () => {
    const factura: Factura = {
      fecha: new Date().toISOString(),
      facturacion_total: total,
      identificador_pedido: id!,
      desglose: order.platos.map((plato) => ({
        plato: plato.nombre,
        precio: plato.precio,
        cantidad: plato.cantidad ?? 0,
        suma: plato.precio * (plato.cantidad ?? 0),
      })),
      subtotal,
      impuesto: 0.21,
      importe_iva: importeIva,
      tipo_propina: propina,
      importe_propina: importePropina,
      total,
    };

    await axios.post("/facturas", factura);
    navigate("/orders");
  };

  return (
    <div className="container ps-5 pe-5">
      <div className="row ps-5 pe-5 mt-5">
        <div className="col-12 ps-5 pe-5">
          <h2>Preview Factura</h2>
          <table className="table mt-5">
            <thead>
              <tr>
                <th>Plato</th>
                <th>Precio Plato</th>
                <th>Cantidad</th>
                <th>Suma</th>
              </tr>
            </thead>
            <tbody>
              {order.platos.map((plato, index) => (
                <tr key={index}>
                  <td>{plato.nombre}</td>
                  <td>{`${plato.precio}€`}</td>
                  <td>{plato.cantidad ?? 0}</td>
                  <td className="align-right">
                    {(plato.precio * (plato.cantidad ?? 0)).toFixed(2)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-start">
              <div className="me-2">
                Propina:{" "}
                <select
                  className="custom-select"
                  value={propina}
                  onChange={(e) => setPropina(Number(e.target.value))}
                >
                  <option value={5}>5%</option>
                  <option value={10}>10%</option>
                  <option value={25}>25%</option>
                </select>
              </div>
              <div>
                Importe Propina: <strong>{importePropina.toFixed(2)}€</strong>
              </div>
            </div>

            <div>
              <div className="align-right">
                Subtotal: <strong>{subtotal.toFixed(2)}€</strong>
              </div>
              <div>
                Impuesto (IVA 21%): <strong>{importeIva.toFixed(2)}€</strong>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-5">
            <div>
              <h5>Total: {total.toFixed(2)}€</h5>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-5 mb-5">
            <button
              className="btn boton-anyadir greenbton"
              onClick={handleConfirm}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturaPreview;
