import React from "react";
import FooterComponent from "./FooterComponent";
import HeaderComponent from "./HeaderComponent";
import BreadcrumbComponent from "../components/BreadcrumbComponent";
import NavbarComponent from "./NavbarComponent";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      <div className="container-fluid">
        <div className="mt-2 ms-4 me-2 d-flex justify-content-between">
          <BreadcrumbComponent />
          <NavbarComponent />
        </div>
        <main>{children}</main>
      </div>
      <FooterComponent />
    </div>
  );
};

export default Layout;
