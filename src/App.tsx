import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import OrderForm from "./components/OrderForm";
import UpdateOrder from "./components/UpdateOrder";
import Login from "./components/Login";
import Layout from "./layout/Layout";

const PrivateRoute: React.FC<{ element: React.FC }> = ({
  element: Element,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <OrderProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/orders"
              element={
                <Layout>
                  <PrivateRoute element={OrderForm} />
                </Layout>
              }
            />
            <Route
              path="/update-order/:id"
              element={
                <Layout>
                  <PrivateRoute element={UpdateOrder} />
                </Layout>
              }
            />
            <Route path="/" element={<Navigate to="/orders" />} />
          </Routes>
        </Router>
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;
