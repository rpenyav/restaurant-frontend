import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Sala } from "../interfaces/sala";

const useSalas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await axios.get("/salas?page=1&limit=10");
        setSalas(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching salas");
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  return { salas, loading, error };
};

export default useSalas;
