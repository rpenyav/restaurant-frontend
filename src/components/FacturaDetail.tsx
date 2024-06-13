import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { formatDate } from "../utils/dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPrint } from "@fortawesome/free-solid-svg-icons";
import LoaderComponent from "./LoaderComponent";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  const handlePrint = async () => {
    const input = document.getElementById("factura-detail");
    if (input) {
      // Ocultar botones antes de imprimir
      const buttons = document.querySelectorAll<HTMLElement>(".no-print");
      buttons.forEach((button) => (button.style.display = "none"));

      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      // Ajuste de márgenes
      const marginTop = 50; // margen superior en milímetros
      const marginBottom = 20; // margen inferior en milímetros
      const marginLeft = 10; // margen izquierdo en milímetros
      const marginRight = 10; // margen derecho en milímetros

      // Agregar logotipo
      const logoUrl =
        "https://res.cloudinary.com/dazfoa93m/image/upload/c_crop,h_286,w_596/v1718277938/bbsb3znnontmbxb3rniq.png"; // Reemplaza con la URL de tu logo
      const logoWidth = 50; // Ajusta el tamaño del logotipo según sea necesario
      const logoHeight = 15; // Ajusta el tamaño del logotipo según sea necesario

      // Agregar imagen con márgenes
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - marginLeft - marginRight;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Añadir logotipo
      pdf.addImage(logoUrl, "PNG", marginLeft, 5, logoWidth, logoHeight);

      // Agregar contenido principal
      pdf.addImage(
        imgData,
        "PNG",
        marginLeft,
        marginTop + logoHeight,
        imgWidth,
        imgHeight
      );

      // Añadir pie de página
      pdf.setFontSize(10);
      pdf.text(
        "Disclaimer: Este es un documento generado automáticamente.",
        marginLeft,
        pdfHeight - marginBottom + 10
      );
      pdf.text(
        "Datos de contacto: example@example.com | +1234567890",
        marginLeft,
        pdfHeight - marginBottom + 15
      );

      pdf.save(`factura_${id}.pdf`);

      // Mostrar botones después de imprimir
      buttons.forEach((button) => (button.style.display = ""));
    }
  };

  if (!factura) return <LoaderComponent />;

  return (
    <div className="container mt-5" id="factura-detail">
      <button
        className="btn greenbton boton-anyadir mb-3 no-print"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> {t("volver")}
      </button>
      <button
        className="btn bluebton boton-anyadir mb-3 ms-3 no-print"
        onClick={handlePrint}
      >
        <FontAwesomeIcon icon={faPrint} /> {t("imprimir")}
      </button>
      <div className="mt-5 d-flex justify-content-between">
        <div>
          <h3>
            {t("detalle_factura")} {factura._id}
          </h3>
        </div>
        <div>
          <h4>
            {t("pedido")}: {factura.identificador_pedido}
          </h4>
        </div>
      </div>

      <div className="mt-3 d-flex justify-content-between">
        <div>
          <h6>
            {t("fecha")}: {formatDate(factura.fecha)}
          </h6>
        </div>
        <div>
          <h6>
            {t("total_facturacion")}: {factura.facturacion_total.toFixed(2)}€
          </h6>
        </div>
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
      <div className="mt-5">
        <div className="d-flex justify-content-between">
          <div>
            <h5>
              {t("impuesto")} (IVA {factura.impuesto * 100}%):{" "}
              {factura.importe_iva.toFixed(2)}€
            </h5>{" "}
            <h5>
              {t("propina")} ({factura.tipo_propina}%):{" "}
              {factura.importe_propina.toFixed(2)}€
            </h5>
          </div>
          <div>
            <h5>
              {t("subtotal")}: {factura.subtotal.toFixed(2)}€
            </h5>
            <h4>
              {t("total")}: {factura.total.toFixed(2)}€
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturaDetail;
