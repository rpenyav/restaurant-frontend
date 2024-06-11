// components/LoaderComponent.tsx
import React from "react";

const LoaderComponent: React.FC = () => {
  return (
    <div className="loader-backdrop">
      <div className="spinner"></div>
    </div>
  );
};

export default LoaderComponent;
