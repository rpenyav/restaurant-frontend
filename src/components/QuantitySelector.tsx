// src/components/shared/QuantitySelector.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isDisabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  isDisabled = false,
}) => {
  return (
    <>
      <button
        className="btn btn-listado"
        onClick={onDecrement}
        disabled={isDisabled}
      >
        <FontAwesomeIcon className="btn-icono" icon={faMinus} />
      </button>
      <span className="mx-2">
        <strong>{quantity || 0}</strong>
      </span>
      <button
        className="btn btn-listado"
        onClick={onIncrement}
        disabled={isDisabled}
      >
        <FontAwesomeIcon className="btn-icono" icon={faPlus} />
      </button>
    </>
  );
};

export default QuantitySelector;
