import React from "react";
import { useDrag } from "react-dnd";

interface MesaProps {
  numero: number;
  capacidad: number;
}

const DraggableMesa: React.FC<MesaProps> = ({ numero, capacidad }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MESA",
    item: { numero, capacidad },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: "bold",
        cursor: "move",
      }}
    >
      Mesa {numero} (Capacidad: {capacidad})
    </div>
  );
};

export default DraggableMesa;
