import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const routeAliases: { [key: string]: string } = {
  orders: "Pedidos",
  "update-order": "Detalle pedido",
  // Agrega más alias según sea necesario
};

const BreadcrumbComponent: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        <FontAwesomeIcon icon={faHome} />
      </Breadcrumb.Item>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const isPenultimate = index === pathnames.length - 2;

        const displayName = routeAliases[value] || value;

        return isLast || isPenultimate ? (
          <Breadcrumb.Item key={to} active>
            {displayName}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={to} linkAs={Link} linkProps={{ to }}>
            {displayName}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
