// create-factura.dto.ts
export class CreateFacturaDto {
  fecha: Date;
  facturacion_total: number;
  identificador_pedido: string; // Nuevo campo para el identificador del pedido
  desglose: {
    plato: string;
    precio: number;
    cantidad: number;
    suma: number;
  }[];
  subtotal: number;
  impuesto: number;
  importe_iva: number;
  tipo_propina: number; // Representa el porcentaje de propina: 5, 10, 25
  importe_propina: number;
  total: number;
}
