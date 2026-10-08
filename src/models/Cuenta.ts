/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clase Abstracta Cuenta - Jerarquía base de Herencia, Encapsulamiento y Polimorfismo
 */

import { Transaccion, TipoTransaccion, DetalleTransaccion } from './Transaccion';

export interface OperacionResultado {
  exito: boolean;
  mensaje: string;
  saldoAnterior: number;
  saldoNuevo: number;
  transaccion?: Transaccion;
  detalles?: Record<string, any>;
}

export abstract class Cuenta {
  // Atributos privados encapsulados
  #numeroCuenta: string;
  #saldo: number;
  #fechaApertura: Date;
  #movimientos: Transaccion[] = [];
  #activa: boolean = true;
  #titularId: string;
  #titularNombre: string;

  constructor(numeroCuenta: string, saldoInicial: number, titularId: string, titularNombre: string) {
    if (saldoInicial < 0) {
      throw new Error("El saldo inicial de una cuenta no puede ser negativo.");
    }
    this.#numeroCuenta = numeroCuenta;
    this.#saldo = Math.round(saldoInicial * 100) / 100;
    this.#titularId = titularId;
    this.#titularNombre = titularNombre;
    this.#fechaApertura = new Date();

    if (saldoInicial > 0) {
      const aperturaTx = new Transaccion({
        tipo: 'CONSIGNACION',
        monto: saldoInicial,
        saldoPosterior: this.#saldo,
        descripcion: 'Depósito inicial de apertura de producto',
        categoria: 'Ingreso',
      });
      this.#movimientos.push(aperturaTx);
    }
  }

  // --- Getters y Setters Encapsulados ---
  get numeroCuenta(): string {
    return this.#numeroCuenta;
  }

  get saldo(): number {
    return this.#saldo;
  }

  // Modificador protegido de saldo interno con validación
  protected setSaldo(nuevoSaldo: number): void {
    this.#saldo = Math.round(nuevoSaldo * 100) / 100;
  }

  get titularId(): string {
    return this.#titularId;
  }

  get titularNombre(): string {
    return this.#titularNombre;
  }

  get fechaApertura(): Date {
    return this.#fechaApertura;
  }

  get activa(): boolean {
    return this.#activa;
  }

  set activa(estado: boolean) {
    this.#activa = estado;
  }

  // Consulta de movimientos usando estructura Array / List<T> ordenada descendente
  consultarMovimientos(): Transaccion[] {
    return [...this.#movimientos].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  protected registrarMovimiento(tx: Transaccion): void {
    this.#movimientos.unshift(tx);
  }

  // Método general: Consultar Saldo
  consultarSaldo(): number {
    return this.saldo;
  }

  // Método común: Consignar dinero con validación estricta de monto positivo
  consignar(monto: number, descripcion: string = 'Consignación en efectivo / transferencia'): OperacionResultado {
    if (monto <= 0) {
      return {
        exito: false,
        mensaje: "El monto a consignar debe ser un valor positivo mayor a cero.",
        saldoAnterior: this.saldo,
        saldoNuevo: this.saldo,
      };
    }

    const saldoAnterior = this.saldo;
    this.setSaldo(saldoAnterior + monto);

    const tx = new Transaccion({
      tipo: 'CONSIGNACION',
      monto,
      saldoPosterior: this.saldo,
      descripcion,
      categoria: 'Ingreso',
    });

    this.registrarMovimiento(tx);

    return {
      exito: true,
      mensaje: `Consignación exitosa por $${monto.toLocaleString('es-CO')} USD. Nuevo saldo: $${this.saldo.toLocaleString('es-CO')} USD.`,
      saldoAnterior,
      saldoNuevo: this.saldo,
      transaccion: tx,
    };
  }

  // --- MÉTODOS POLIMÓRFICOS OBLIGATORIOS ---
  /**
   * Polimorfismo: Cada tipo de cuenta aplica sus propias reglas para procesar un retiro.
   * - Cuenta Ahorros: Aplica 1.5% mensual en el momento del retiro; restricción monto <= saldo.
   * - Cuenta Corriente: Permite sobregiro de hasta 20% adicional sobre el saldo actual.
   * - Tarjeta Crédito: Aplica contra cupo disponible y calcula cuotas/intereses.
   */
  abstract retirar(monto: number, descripcion?: string): OperacionResultado;

  /**
   * Polimorfismo: Calcula el límite máximo disponible para retirar o disponer
   */
  abstract calcularLimiteRetiro(): number;

  /**
   * Polimorfismo: Identificador y descripción del producto
   */
  abstract obtenerTipo(): 'AHORROS' | 'CORRIENTE' | 'TARJETA_CREDITO';
  abstract obtenerNombreComercial(): string;
  abstract obtenerResumenProducto(): Record<string, any>;

  // Carga de historial previo (para hidratación desde almacenamiento)
  cargarMovimientos(movimientos: Transaccion[]): void {
    this.#movimientos = movimientos;
  }
}
