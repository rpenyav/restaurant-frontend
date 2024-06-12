export interface Order {
  _id?: string;
  mesa_id: string;
  estado: string;
  platos: {
    plato_id: string;
    comidaId: string;
    cantidad: number;
    precio: number;
  }[];
  total: number;
  impuesto: number;
  propina: number;
  total_con_impuesto_y_propina: number;
  camarero_id: string;
  fecha: string;
}

export interface OrderToCreate {
  mesa_id: string;
  estado: string;
  platos: {
    plato_id: string;
    comidaId: string;
    cantidad: number;
  }[];
  total: number;
  impuesto: number;
  propina: number;
  total_con_impuesto_y_propina: number;
  camarero_id?: string;
  fecha: string;
}

export interface OrderFactura {
  _id?: string;
  mesa_id: string;
  estado: string;
  platos: {
    plato_id: string;
    comidaId: string;
    cantidad: number;
    precio: number;
    nombre: string;
  }[];
  total: number;
  impuesto: number;
  propina: number;
  total_con_impuesto_y_propina: number;
  camarero_id: string;
  fecha: string;
}
