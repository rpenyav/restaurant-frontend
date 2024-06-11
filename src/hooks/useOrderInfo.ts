// src/hooks/useOrderInfo.ts
import { useState, useEffect } from "react";
import { fetchSalaByMesaId } from "../services/salaService";

interface SalaInfo {
  nombre: string;
  numero: number;
}

const useOrderInfo = (mesaId: string) => {
  const [salaInfo, setSalaInfo] = useState<SalaInfo | null>(null);

  useEffect(() => {
    const fetchSalaInfo = async () => {
      try {
        const { sala, mesa } = await fetchSalaByMesaId(mesaId);
        setSalaInfo({ nombre: sala.nombre, numero: mesa.numero });
      } catch (error) {
        console.error(`Error fetching sala for mesa_id ${mesaId}:`, error);
      }
    };

    if (mesaId) {
      fetchSalaInfo();
    }
  }, [mesaId]);

  return { salaInfo };
};

export default useOrderInfo;
