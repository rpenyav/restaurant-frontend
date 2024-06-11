import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import OrderList from "../components/OrderList";
import OrderModal from "../components/OrderModal";

const Order: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container">
      <div className="d-flex justify-content-end my-3">
        <button
          className="btn boton-anyadir greenbton"
          onClick={handleOpenModal}
        >
          <FontAwesomeIcon icon={faPlus} /> Nuevo pedido
        </button>
      </div>
      <OrderList />
      <OrderModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default Order;
