import axios from "../api/axios";

export const fetchSalaByMesaId = async (mesaId: string) => {
  try {
    const response = await axios.get(`/salas`);
    const salas = response.data.data;
    if (!Array.isArray(salas)) {
      throw new Error("Salas is not an array");
    }

    for (const sala of salas) {
      const mesa = sala.mesas.find((m: any) => m._id === mesaId);
      if (mesa) {
        return { sala, mesa };
      }
    }
    throw new Error(`Mesa with ID ${mesaId} not found`);
  } catch (error: any) {
    throw new Error(
      `Error fetching sala for mesaId ${mesaId}: ${error.message}`
    );
  }
};
