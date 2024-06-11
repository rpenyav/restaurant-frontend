import React from "react";
import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrderList";

const Order: React.FC = () => {
  return (
    <div>
      <OrderForm />
      <OrderList />
    </div>
  );
};

export default Order;
