export class CreatePedidoDto {
  readonly mesa_id: string;
  readonly estado: string;
  readonly platos: {
    plato_id: string;
    cantidad: number;
    nombre?: string;
    precio?: number;
    comidaId: string; // Añade comidaId aquí
  }[];
  readonly total: number;
  readonly impuesto: number;
  readonly propina: number;
  readonly total_con_impuesto_y_propina: number;
  readonly camarero_id: string;
  readonly fecha: Date;
}
