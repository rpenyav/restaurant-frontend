import { Plato } from "./plato";

export interface Order {
  _id?: string;
  mesa_id: string;
  estado: string;
  platos: Plato[];
  total: number;
  impuesto: number;
  propina: number;
  total_con_impuesto_y_propina: number;
  camarero_id: string;
  fecha: string;
}
