import { useState } from "react";

const usePropina = (subtotal: number) => {
  const [propina, setPropina] = useState<number>(10);

  const importePropina = subtotal * (propina / 100);

  return {
    propina,
    setPropina,
    importePropina,
  };
};

export default usePropina;
