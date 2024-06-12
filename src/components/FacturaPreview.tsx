import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoaderComponent from "./LoaderComponent";
import useFactura from "../hooks/useFactura";
import usePropina from "../hooks/usePropina";

const FacturaPreview: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { order, handleConfirm } = useFactura(id);
  const { propina, setPropina, importePropina } = usePropina(
    order
      ? order.platos.reduce(
          (acc, plato) => acc + plato.precio * (plato.cantidad ?? 0),
          0
        )
      : 0
  );

  if (!order) return <LoaderComponent />;

  const subtotal = order.platos.reduce((acc, plato) => {
    return acc + plato.precio * (plato.cantidad ?? 0);
  }, 0);

  const importeIva = subtotal * 0.21;
  const total = subtotal + importeIva + importePropina;

  const factura = {
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

  return (
    <div className="container ps-5 pe-5">
      <div className="row ps-5 pe-5 mt-5">
        <div className="col-12 ps-5 pe-5">
          <h2>{t("preview_factura")}</h2>
          <table className="table mt-5">
            <thead>
              <tr>
                <th>{t("plato")}</th>
                <th>{t("precio_plato")}</th>
                <th>{t("cantidad")}</th>
                <th>{t("suma")}</th>
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
                {t("propina")}:{" "}
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
                {t("importe_propina")}:{" "}
                <strong>{importePropina.toFixed(2)}€</strong>
              </div>
            </div>

            <div>
              <div className="align-right">
                {t("subtotal")}: <strong>{subtotal.toFixed(2)}€</strong>
              </div>
              <div>
                {t("impuesto")} (IVA 21%):{" "}
                <strong>{importeIva.toFixed(2)}€</strong>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-5">
            <div>
              <h5>
                {t("total")}: {total.toFixed(2)}€
              </h5>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-5 mb-5">
            <button
              className="btn boton-anyadir greenbton"
              onClick={() => handleConfirm(factura)}
            >
              {t("confirmar")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturaPreview;
