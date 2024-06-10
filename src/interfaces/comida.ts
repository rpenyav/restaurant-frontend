import { Plato } from "./plato";

export interface Comida {
  _id: string;
  tipo: string;
  platos: Plato[];
}
