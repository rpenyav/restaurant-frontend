import React from "react";
import { Modal, Button } from "react-bootstrap";
import OrderForm from "./OrderForm";

interface OrderModalProps {
  show: boolean;
  handleClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ show, handleClose }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="modal-lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <OrderForm />
      </Modal.Body>
    </Modal>
  );
};

export default OrderModal;
