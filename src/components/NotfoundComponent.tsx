// components/NotFound.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="container text-center mt-5" style={{ minHeight: "400px" }}>
      <h1 style={{ fontSize: "120px" }}>404</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
    </div>
  );
};

export default NotFound;
