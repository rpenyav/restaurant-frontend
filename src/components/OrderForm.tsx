import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useOrders } from "../context/OrderContext";
import { Plato } from "../interfaces/plato";
import { Order } from "../interfaces/order";

const OrderForm: React.FC = () => {
  const { userId } = useUser();
  const { addOrder, salas, comidas, error, clearError } = useOrders();

  const [mesaId, setMesaId] = useState("");
  const [platosSeleccionados, setPlatosSeleccionados] = useState<Plato[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      let totalSum = 0;
      if (comidas) {
        platosSeleccionados.forEach((plato) => {
          const foundPlato = comidas
            .flatMap((comida) => comida.platos)
            .find((p) => p._id === plato._id);
          if (foundPlato) {
            totalSum += foundPlato.precio * (plato.cantidad ?? 0);
          }
        });
      }
      setTotal(totalSum);
    };

    calculateTotal();
  }, [platosSeleccionados, comidas]);

  const handleAddOrder = () => {
    const order: Order = {
      mesa_id: mesaId,
      estado: "open",
      platos: platosSeleccionados,
      total,
      impuesto: 0,
      propina: 0,
      total_con_impuesto_y_propina: total,
      camarero_id: userId,
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
      .flatMap((comida) => comida.platos)
      .find((p) => p._id === plato_id);

    if (foundPlato) {
      const updatedPlatos = platosSeleccionados.map((plato, i) =>
        i === index ? { ...foundPlato, cantidad: plato.cantidad } : plato
      );
      setPlatosSeleccionados(updatedPlatos);
    }
  };

  const handleCantidadChange = (index: number, cantidad: number) => {
    const updatedPlatos = platosSeleccionados.map((plato, i) =>
      i === index ? { ...plato, cantidad } : plato
    );
    setPlatosSeleccionados(updatedPlatos);
  };

  return (
    <div>
      <h2>Nuevo Pedido</h2>
      {error && (
        <div style={{ color: "red" }}>
          {error}
          <button onClick={clearError}>X</button>
        </div>
      )}
      <label htmlFor="mesaSelect">Mesa</label>
      <select
        id="mesaSelect"
        value={mesaId}
        onChange={(e) => setMesaId(e.target.value)}
      >
        <option value="">Seleccione una mesa</option>
        {salas.map((sala) => (
          <optgroup key={sala._id} label={sala.nombre}>
            {sala.mesas.map((mesa) => (
              <option key={mesa._id} value={mesa._id}>
                Mesa {mesa.numero} (Capacidad: {mesa.capacidad})
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {platosSeleccionados.map((plato, index) => (
        <div key={index}>
          <label htmlFor={`platoSelect${index}`}>Plato</label>
          <select
            id={`platoSelect${index}`}
            value={plato._id}
            onChange={(e) => handlePlatoChange(index, e.target.value)}
          >
            <option value="">Seleccione un plato</option>
            {comidas.map((comida) => (
              <optgroup key={comida._id} label={comida.tipo}>
                {comida.platos.map((platoItem) => (
                  <option key={platoItem._id} value={platoItem._id}>
                    {platoItem.nombre}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <input
            type="number"
            placeholder="Cantidad"
            value={plato.cantidad ?? 0}
            onChange={(e) =>
              handleCantidadChange(index, Number(e.target.value))
            }
          />
          <span>{plato.precio * (plato.cantidad ?? 0)}</span>
          <button onClick={() => handleRemovePlato(index)}>Eliminar</button>
        </div>
      ))}
      <button onClick={handleAddPlato}>Añadir Plato</button>
      <div>
        <strong>Total:</strong> {total.toFixed(2)}
      </div>
      <button onClick={handleAddOrder}>Crear Pedido</button>
    </div>
  );
};

export default OrderForm;
