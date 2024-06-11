import React from "react";
import { Modal } from "react-bootstrap";
import OrderForm from "./OrderForm";

interface OrderModalProps {
  show: boolean;
  handleClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <OrderForm onClose={handleClose} />
      </Modal.Body>
    </Modal>
  );
};

export default OrderModal;
