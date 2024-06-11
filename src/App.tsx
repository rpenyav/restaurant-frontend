import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";

import UpdateOrder from "./components/UpdateOrder";
import Login from "./components/Login";
import Layout from "./layout/Layout";
import FacturaPreview from "./components/FacturaPreview";
import Order from "./pages/Order";

const PrivateRoute: React.FC<{ element: React.FC }> = ({
  element: Element,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

const AuthRoute: React.FC<{ element: React.FC }> = ({ element: Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/orders" /> : <Element />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthRoute element={Login} />} />
        <Route
          path="/orders"
          element={
            <Layout>
              <PrivateRoute element={Order} />
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
        <Route
          path="/factura-preview/:id"
          element={
            <Layout>
              <PrivateRoute element={FacturaPreview} />
            </Layout>
          }
        />
        <Route path="/" element={<Navigate to="/orders" />} />
      </Routes>
    </Router>
  );
};

export default App;
