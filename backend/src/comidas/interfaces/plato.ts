import { Types } from 'mongoose';

export interface Plato {
  _id?: Types.ObjectId;
  nombre: string;
  stock: number;
  descripcion?: string;
  precio: number;
  ingredientes: string[];
  disponibilidad: boolean;
  particularidades_alimentarias: {
    celiaco: boolean;
    alergenos: string[];
  };
  comidaId: string; // Añadir esta línea
}
