import React from "react";
import { useDrop } from "react-dnd";
import DraggableMesa from "./DraggableMesa";

interface SalaProps {
  nombre: string;
  mesas: Array<{ numero: number; capacidad: number; _id: string }>;
}

const DroppableSala: React.FC<SalaProps> = ({ nombre, mesas }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "MESA",
    drop: (item: { numero: number }, monitor) => {
      const offset = monitor.getClientOffset();
      // Aquí se puede manejar la lógica de actualización de coordenadas
      console.log(`Mesa ${item.numero} dropped at ${offset}`);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        border: "1px solid black",
        padding: "20px",
        margin: "10px",
        backgroundColor: isOver ? "lightgreen" : "white",
      }}
    >
      <h2>{nombre}</h2>
      {mesas.map((mesa) => (
        <DraggableMesa
          key={mesa._id}
          numero={mesa.numero}
          capacidad={mesa.capacidad}
        />
      ))}
    </div>
  );
};

export default DroppableSala;
