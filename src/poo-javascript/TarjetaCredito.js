/**
 * @file TarjetaCredito.js
 * @description Subclase TarjetaCredito según el Diagrama UML de &rys Bank
 * Pilares POO: Herencia (extends Cuenta), Encapsulamiento (#) y Polimorfismo
 * 
 * Reglas de Negocio Oficiales:
 * - El banco asigna un cupo de crédito; cada compra genera una deuda a pagar.
 * - Cada transacción debe mostrar el valor del pago mensual resultante.
 * - Tabla de tasas de interés aplicables:
 *   <= 2 cuotas: 0% (Sin interés)
 *   3 a 6 cuotas: 1.9% mensual (Interés moderado)
 *   >= 7 cuotas: 2.3% mensual (Interés alto)
 * - Fórmula matemática oficial:
 *   Cuota mensual = (Capital * tasa) / (1 - (1 + tasa)^(-n))
 */

import { Cuenta } from './Cuenta.js';

export class TarjetaCredito extends Cuenta {
  // Atributos privados (-) según Diagrama UML
  #cupoCredito;
  #deudaActual;

  /**
   * @param {string} numeroCuenta
   * @param {number} cupoCredito - Límite de crédito asignado por el banco
   */
  constructor(numeroCuenta, cupoCredito = 5000) {
    // Inicializa el saldo representativo con el cupo de crédito
    super(numeroCuenta, cupoCredito, 'Tarjeta de Crédito');
    this.#cupoCredito = Number(cupoCredito);
    this.#deudaActual = 0;
  }

  get cupoCredito() {
    return this.#cupoCredito;
  }

  get deudaActual() {
    return this.#deudaActual;
  }

  get cupoDisponible() {
    return Math.max(0, Math.round((this.#cupoCredito - this.#deudaActual) * 100) / 100);
  }

  /**
   * Determina la tasa mensual decimal según el plazo de cuotas
   * @param {number} cuotas
   * @returns {number}
   */
  obtenerTasaMensual(cuotas) {
    const n = Math.floor(cuotas);
    if (n <= 2) {
      return 0.0; // <= 2 cuotas: 0% mensual (Sin interés)
    } else if (n <= 6) {
      return 0.019; // 3 a 6 cuotas: 1.9% mensual
    } else {
      return 0.023; // >= 7 cuotas: 2.3% mensual
    }
  }

  /**
   * Método público (+) según Diagrama UML: calcularCuotaMensual(float capital, int cuotas) float
   * Aplica la fórmula francesa: Cuota = (Capital * tasa) / (1 - (1 + tasa)^(-n))
   * @param {number} capital
   * @param {number} cuotas
   * @returns {number} Valor del pago mensual
   */
  calcularCuotaMensual(capital, cuotas) {
    const P = Number(capital);
    const n = Math.floor(Number(cuotas));

    if (P <= 0 || n < 1) return 0;

    const tasa = this.obtenerTasaMensual(n);

    let cuota = 0;
    if (tasa === 0) {
      // 0% de interés para 1 o 2 cuotas
      cuota = P / n;
    } else {
      // Fórmula estándar financiera
      const factor = Math.pow(1 + tasa, -n);
      cuota = (P * tasa) / (1 - factor);
    }

    return Math.round(cuota * 100) / 100;
  }

  /**
   * Método público (+) según Diagrama UML: financiarCompra(float capital, int cuotas)
   * Realiza una compra a cuotas afectando el cupo y registrando la deuda
   * @param {number} capital
   * @param {number} cuotas
   * @param {string} [comercio='Comercio General']
   * @returns {{ exito: boolean, mensaje: string, detalles?: object }}
   */
  financiarCompra(capital, cuotas, comercio = 'Comercio General') {
    const P = Number(capital);
    const n = Math.floor(Number(cuotas));

    if (isNaN(P) || P <= 0) {
      return { exito: false, mensaje: "El valor de la compra debe ser mayor a cero." };
    }

    if (n < 1) {
      return { exito: false, mensaje: "El número de cuotas debe ser mínimo 1." };
    }

    // Validación de cupo de crédito disponible
    if (P > this.cupoDisponible) {
      return {
        exito: false,
        mensaje: `Cupo de crédito insuficiente. Monto de compra: $${P.toLocaleString('es-CO')} USD, Cupo libre: $${this.cupoDisponible.toLocaleString('es-CO')} USD.`,
      };
    }

    // Cálculo financiero del pago mensual
    const cuotaMensual = this.calcularCuotaMensual(P, n);
    const tasa = this.obtenerTasaMensual(n);
    const totalPagar = Math.round(cuotaMensual * n * 100) / 100;
    const interesesTotales = Math.round((totalPagar - P) * 100) / 100;

    // Actualizamos deuda y saldo representativo
    this.#deudaActual = Math.round((this.#deudaActual + P) * 100) / 100;
    this._setSaldo(this.cupoDisponible);
    this.agregarMovimiento(`COMPRA_CREDITO_${comercio}`, P);

    const tasaPorcentaje = tasa === 0 ? '0% (Sin interés)' : `${(tasa * 100).toFixed(1)}% mensual`;

    return {
      exito: true,
      mensaje: `Compra en ${comercio} aprobada por $${P.toLocaleString('es-CO')} USD. Pago mensual: $${cuotaMensual.toLocaleString('es-CO')} USD (${n} cuota(s) a tasa ${tasaPorcentaje}). Cupo disponible: $${this.cupoDisponible.toLocaleString('es-CO')} USD.`,
      detalles: {
        capital: P,
        cuotas: n,
        tasaMensual: tasa,
        cuotaMensual,
        totalPagar,
        interesesTotales,
      },
    };
  }

  /**
   * POLIMORFISMO: Implementación de retirar(float monto) como avance de efectivo
   * @param {number} monto
   * @returns {{ exito: boolean, mensaje: string }}
   */
  retirar(monto) {
    // Por defecto, un avance con tarjeta se financia a 12 cuotas a tasa estándar del 2.3%
    return this.financiarCompra(monto, 12, 'Avance en Cajero Automático');
  }

  /**
   * Pagar la deuda de la tarjeta para liberar cupo
   * @param {number} monto
   * @returns {{ exito: boolean, mensaje: string }}
   */
  pagarDeuda(monto) {
    const valor = Number(monto);
    if (isNaN(valor) || valor <= 0) {
      return { exito: false, mensaje: "El monto a pagar debe ser mayor a cero." };
    }

    if (this.#deudaActual <= 0) {
      return { exito: false, mensaje: "No tienes deuda pendiente en tu Tarjeta de Crédito." };
    }

    const valorAbonado = Math.min(valor, this.#deudaActual);
    this.#deudaActual = Math.round((this.#deudaActual - valorAbonado) * 100) / 100;
    this._setSaldo(this.cupoDisponible);
    this.agregarMovimiento('PAGO_TARJETA', valorAbonado);

    return {
      exito: true,
      mensaje: `Pago acreditado por $${valorAbonado.toLocaleString('es-CO')} USD. Deuda restante: $${this.#deudaActual.toLocaleString('es-CO')} USD. Cupo disponible: $${this.cupoDisponible.toLocaleString('es-CO')} USD.`,
    };
  }
}
