/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Entidad Transaccion - Pilar de Abstracción y Encapsulamiento
 */

export type TipoTransaccion = 
  | 'CONSIGNACION'
  | 'RETIRO'
  | 'TRANSFERENCIA_ENVIADA'
  | 'TRANSFERENCIA_RECIBIDA'
  | 'COMPRA_CREDITO'
  | 'PAGO_TARJETA'
  | 'RENDIMIENTO_INTERES'
  | 'SOBREGIRO_UTILIZADO';

export interface DetalleTransaccion {
  cuotas?: number;
  tasaInteres?: number;
  cuotaMensual?: number;
  interesGenerado?: number;
  sobregiroUsado?: number;
  comercio?: string;
  cuentaDestino?: string;
  cuentaOrigen?: string;
  titularRelacionado?: string;
}

export class Transaccion {
  readonly #id: string;
  readonly #fecha: Date;
  readonly #tipo: TipoTransaccion;
  readonly #monto: number;
  readonly #saldoPosterior: number;
  readonly #descripcion: string;
  readonly #categoria: 'Ingreso' | 'Gasto' | 'Inversión' | 'Transferencia' | 'Crédito';
  readonly #detalles?: DetalleTransaccion;
  readonly #estado: 'Completada' | 'Acreditado' | 'Procesando';

  constructor(params: {
    tipo: TipoTransaccion;
    monto: number;
    saldoPosterior: number;
    descripcion: string;
    categoria?: 'Ingreso' | 'Gasto' | 'Inversión' | 'Transferencia' | 'Crédito';
    detalles?: DetalleTransaccion;
    fecha?: Date;
    estado?: 'Completada' | 'Acreditado' | 'Procesando';
    id?: string;
  }) {
    if (params.monto < 0) {
      throw new Error("El monto de la transacción debe ser un número positivo.");
    }
    this.#id = params.id || `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    this.#fecha = params.fecha || new Date();
    this.#tipo = params.tipo;
    this.#monto = Math.round(params.monto * 100) / 100;
    this.#saldoPosterior = Math.round(params.saldoPosterior * 100) / 100;
    this.#descripcion = params.descripcion;
    this.#categoria = params.categoria || this.#deducirCategoria(params.tipo);
    this.#detalles = params.detalles;
    this.#estado = params.estado || (params.tipo === 'CONSIGNACION' || params.tipo === 'RENDIMIENTO_INTERES' ? 'Acreditado' : 'Completada');
  }

  #deducirCategoria(tipo: TipoTransaccion): 'Ingreso' | 'Gasto' | 'Inversión' | 'Transferencia' | 'Crédito' {
    switch (tipo) {
      case 'CONSIGNACION':
      case 'TRANSFERENCIA_RECIBIDA':
        return 'Ingreso';
      case 'RENDIMIENTO_INTERES':
        return 'Inversión';
      case 'RETIRO':
        return 'Gasto';
      case 'TRANSFERENCIA_ENVIADA':
        return 'Transferencia';
      case 'COMPRA_CREDITO':
      case 'PAGO_TARJETA':
        return 'Crédito';
      default:
        return 'Gasto';
    }
  }

  // Getters para garantizar el principio de Encapsulamiento
  get id(): string { return this.#id; }
  get fecha(): Date { return this.#fecha; }
  get fechaFormateada(): string {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(this.#fecha);
  }
  get fechaCorta(): string {
    const hoy = new Date();
    const esHoy = this.#fecha.toDateString() === hoy.toDateString();
    if (esHoy) {
      return `Hoy, ${this.#fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return this.#fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  }
  get tipo(): TipoTransaccion { return this.#tipo; }
  get monto(): number { return this.#monto; }
  get saldoPosterior(): number { return this.#saldoPosterior; }
  get descripcion(): string { return this.#descripcion; }
  get categoria(): 'Ingreso' | 'Gasto' | 'Inversión' | 'Transferencia' | 'Crédito' { return this.#categoria; }
  get detalles(): DetalleTransaccion | undefined { return this.#detalles; }
  get estado(): 'Completada' | 'Acreditado' | 'Procesando' { return this.#estado; }

  // Serialización para persistencia
  toJSON() {
    return {
      id: this.#id,
      fecha: this.#fecha.toISOString(),
      tipo: this.#tipo,
      monto: this.#monto,
      saldoPosterior: this.#saldoPosterior,
      descripcion: this.#descripcion,
      categoria: this.#categoria,
      detalles: this.#detalles,
      estado: this.#estado,
    };
  }

  static fromJSON(data: any): Transaccion {
    return new Transaccion({
      id: data.id,
      fecha: new Date(data.fecha),
      tipo: data.tipo,
      monto: data.monto,
      saldoPosterior: data.saldoPosterior,
      descripcion: data.descripcion,
      categoria: data.categoria,
      detalles: data.detalles,
      estado: data.estado,
    });
  }
}
