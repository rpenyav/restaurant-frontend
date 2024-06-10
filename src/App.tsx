import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { OrderProvider } from "./context/OrderContext";
import OrderForm from "./components/OrderForm";
import UpdateOrder from "./components/UpdateOrder";

const App: React.FC = () => {
  return (
    <UserProvider>
      <OrderProvider>
        <Router>
          <Routes>
            <Route path="/" element={<OrderForm />} />
            <Route path="/update-order/:id" element={<UpdateOrder />} />
          </Routes>
        </Router>
      </OrderProvider>
    </UserProvider>
  );
};

export default App;
