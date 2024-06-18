import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import axios from "../api/axios";

import { useTranslation } from "react-i18next";

interface Mesa {
  _id: string;
  numero: number;
  capacidad: number;
  coordenadas?: string; // Añadir el campo de coordenadas
}

interface Sala {
  _id: string;
  nombre: string;
  mesas: Mesa[];
}

const SalaMesasPage: React.FC = () => {
  const { t } = useTranslation();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await axios.get("/salas?page=1&limit=10");
        setSalas(response.data.data);
      } catch (error) {
        console.error("Error fetching salas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  const handleStop = (salaId: string, mesaId: string, data: any) => {
    const coordenadas = `${data.x},${data.y}`;
    axios
      .put(`/salas/${salaId}/mesa/${mesaId}/coordenadas`, { coordenadas })
      .catch((error) => {
        console.error("Error updating coordinates:", error);
      });
  };

  if (loading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="container">
      {salas.map((sala) => (
        <div key={sala._id} className="sala">
          <h3>{sala.nombre}</h3>
          <div className="sala-area">
            {sala.mesas.map((mesa) => (
              <Draggable
                key={mesa._id}
                bounds="parent"
                defaultPosition={
                  mesa.coordenadas
                    ? {
                        x: parseInt(mesa.coordenadas.split(",")[0]),
                        y: parseInt(mesa.coordenadas.split(",")[1]),
                      }
                    : { x: 0, y: 0 }
                }
                onStop={(e, data) => handleStop(sala._id, mesa._id, data)}
              >
                <div className="mesa-circle">{mesa.numero}</div>
              </Draggable>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalaMesasPage;
