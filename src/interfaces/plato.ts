export interface Plato {
  _id: string;
  nombre: string;
  stock: number;
  descripcion?: string;
  precio: number;
  ingredientes: string[];
  disponibilidad: boolean;
  particularidades_alimentarias: {
    celiaco: boolean;
    alergenos: string[];
    _id: string;
  };
  comidaId: string;
  cantidad?: number; // Añadir cantidad aquí para los platos en pedidos
}
