import React from "react";
import { Modal } from "react-bootstrap";
import OrderForm from "./OrderForm";
import { useTranslation } from "react-i18next";

interface OrderModalProps {
  show: boolean;
  handleClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ show, handleClose }) => {
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("crear_pedido")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <OrderForm onClose={handleClose} />
      </Modal.Body>
    </Modal>
  );
};

export default OrderModal;
