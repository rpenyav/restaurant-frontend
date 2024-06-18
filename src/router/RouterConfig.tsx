import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UpdateOrder from "../components/UpdateOrder";
import Login from "../components/Login";
import Layout from "../layout/Layout";
import FacturaPreview from "../components/FacturaPreview";
import Order from "../pages/Order";
import FacturaDetail from "../components/FacturaDetail";
import FacturaList from "../components/FacturaList";
import AdminRoute from "./AdminRoute";
import NotFound from "../components/NotfoundComponent";
import PrivateRoute from "./PrivateRoute";
import { AuthRoute } from "./AuthRoute";
import UserProfile from "../components/UserProfile";
import SalaMesasPage from "../components/SalaMesasPage"; // Importa el nuevo componente

const RouterConfig: React.FC = () => {
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
        <Route
          path="/factura-detail/:id"
          element={
            <Layout>
              <PrivateRoute element={FacturaDetail} />
            </Layout>
          }
        />
        <Route
          path="/facturas"
          element={
            <Layout>
              <AdminRoute element={FacturaList} />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <PrivateRoute element={UserProfile} />
            </Layout>
          }
        />
        <Route
          path="/salas-mesas" // Agrega la nueva ruta
          element={
            <Layout>
              <PrivateRoute element={SalaMesasPage} />
            </Layout>
          }
        />
        <Route path="/" element={<Navigate to="/orders" />} />
        <Route
          path="/404"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
};

export default RouterConfig;
