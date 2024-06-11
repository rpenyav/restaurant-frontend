// interfaces/factura.ts
export interface Desglose {
  plato: string;
  precio: number;
  cantidad: number;
  suma: number;
}

export interface Factura {
  fecha: string;
  facturacion_total: number;
  identificador_pedido: string;
  desglose: Desglose[];
  subtotal: number;
  impuesto: number;
  importe_iva: number;
  tipo_propina: number;
  importe_propina: number;
  total: number;
}
