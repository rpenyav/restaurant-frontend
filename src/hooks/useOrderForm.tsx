import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useOrders } from "../context/OrderContext";
import { OrderToCreate } from "../interfaces/order";
import { Plato } from "src/interfaces/plato";

const useOrderForm = () => {
  const { userId } = useUser();
  const { addOrder, salas, comidas, error, clearError } = useOrders();
  const [mesaId, setMesaId] = useState("");
  const [platosSeleccionados, setPlatosSeleccionados] = useState<Plato[]>([]);
  const [total, setTotal] = useState(0);

  const calculateTotal = () => {
    let totalSum = 0;
    if (comidas) {
      platosSeleccionados.forEach((plato) => {
        const foundPlato = comidas
          ?.flatMap((comida) => comida.platos)
          .find((p) => p?._id === plato._id);
        if (foundPlato) {
          totalSum += foundPlato.precio * (plato.cantidad ?? 0);
        }
      });
    }
    setTotal(totalSum);
  };

  useEffect(() => {
    calculateTotal();
  }, [platosSeleccionados, comidas]);

  const handleAddOrder = () => {
    const validPlatos = platosSeleccionados
      .filter((plato) => plato._id && (plato.cantidad ?? 0) > 0)
      .map((plato) => ({
        plato_id: plato._id,
        comidaId: plato.comidaId,
        cantidad: plato.cantidad ?? 0,
      }));

    const order: OrderToCreate = {
      mesa_id: mesaId,
      estado: "open",
      platos: validPlatos,
      total: 0,
      impuesto: 0,
      propina: 0,
      total_con_impuesto_y_propina: 0,
      camarero_id: userId!,
      fecha: new Date().toISOString(),
    };

    addOrder(order);
  };

  const handleAddPlato = () => {
    setPlatosSeleccionados([
      ...platosSeleccionados,
      {
        _id: "",
        nombre: "",
        stock: 0,
        descripcion: "",
        precio: 0,
        ingredientes: [],
        disponibilidad: false,
        particularidades_alimentarias: {
          celiaco: false,
          alergenos: [],
          _id: "",
        },
        comidaId: "",
        cantidad: 1,
      },
    ]);
  };

  const handleRemovePlato = (index: number) => {
    const newPlatos = platosSeleccionados.filter((_, i) => i !== index);
    setPlatosSeleccionados(newPlatos);
  };

  const handlePlatoChange = (index: number, plato_id: string) => {
    const foundPlato = comidas
      ?.flatMap((comida) => comida.platos)
      .find((p) => p._id === plato_id);

    if (foundPlato) {
      const updatedPlatos = platosSeleccionados.map((plato, i) =>
        i === index ? { ...foundPlato, cantidad: plato.cantidad } : plato
      );
      setPlatosSeleccionados(updatedPlatos);
    }
  };

  const handleIncrementCantidad = (index: number) => {
    const newPlatos = [...platosSeleccionados];
    if (newPlatos[index]) {
      newPlatos[index].cantidad = (newPlatos[index].cantidad ?? 0) + 1;
      setPlatosSeleccionados(newPlatos);
    }
  };

  const handleDecrementCantidad = (index: number) => {
    const newPlatos = [...platosSeleccionados];
    const currentCantidad = newPlatos[index]?.cantidad;

    if (currentCantidad && currentCantidad > 1) {
      newPlatos[index].cantidad = currentCantidad - 1;
    } else if (newPlatos[index]) {
      newPlatos[index].cantidad = 1;
    }

    setPlatosSeleccionados(newPlatos);
  };

  const isAddOrderDisabled = platosSeleccionados.some((plato) => !plato._id);

  return {
    mesaId,
    setMesaId,
    platosSeleccionados,
    total,
    error,
    clearError,
    salas,
    comidas,
    handleAddOrder,
    handleAddPlato,
    handleRemovePlato,
    handlePlatoChange,
    handleIncrementCantidad,
    handleDecrementCantidad,
    isAddOrderDisabled,
  };
};

export default useOrderForm;
