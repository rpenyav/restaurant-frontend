import { Mesa } from "./mesa";

export interface Sala {
  _id: string;
  nombre: string;
  mesas: Mesa[];
}
