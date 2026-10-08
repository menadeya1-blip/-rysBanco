/**
 * @file CuentaAhorros.js
 * @description Subclase CuentaAhorros según el Diagrama UML de &rys Bank
 * Pilares POO: Herencia (extends Cuenta), Encapsulamiento (#) y Polimorfismo (retirar)
 * 
 * Reglas de Negocio Oficiales:
 * - Propósito: Guardar dinero a mediano y largo plazo.
 * - Generación de intereses: Tasa mensual del 1.5%, calculada y aplicada en el momento del retiro.
 * - Restricción: El monto a retirar no puede superar el saldo disponible.
 */

import { Cuenta } from './Cuenta.js';

export class CuentaAhorros extends Cuenta {
  // Atributo privado (-) según Diagrama UML
  #tasaInteresMensual;

  /**
   * @param {string} numeroCuenta
   * @param {number} saldoInicial
   * @param {number} [tasaInteresMensual=0.015] - Tasa mensual de 1.5%
   */
  constructor(numeroCuenta, saldoInicial = 0, tasaInteresMensual = 0.015) {
    super(numeroCuenta, saldoInicial, 'Cuenta de Ahorros');
    this.#tasaInteresMensual = Number(tasaInteresMensual);
  }

  get tasaInteresMensual() {
    return this.#tasaInteresMensual;
  }

  /**
   * Método público (+) según Diagrama UML: aplicarInteres()
   * Calcula el 1.5% mensual sobre el saldo y lo acredita
   * @returns {number} Monto de interés acreditado
   */
  aplicarInteres() {
    const interes = Math.round(this.saldo * this.#tasaInteresMensual * 100) / 100;
    if (interes > 0) {
      this._setSaldo(this.saldo + interes);
      this.agregarMovimiento('RENDIMIENTO_INTERES', interes);
    }
    return interes;
  }

  /**
   * POLIMORFISMO: Sobrescritura de retirar(float monto) según Diagrama UML
   * Regla de negocio: Aplica el 1.5% mensual en el momento del retiro
   * Restricción: No puede superar el saldo disponible
   * @param {number} monto
   * @returns {{ exito: boolean, mensaje: string, detalles?: object }}
   */
  retirar(monto) {
    const valor = Number(monto);
    if (isNaN(valor) || valor <= 0) {
      return { exito: false, mensaje: "El monto a retirar debe ser mayor a cero." };
    }

    // Regla de Negocio: No puede superar el saldo disponible
    if (valor > this.saldo) {
      return {
        exito: false,
        mensaje: `Fondos insuficientes en Cuenta de Ahorros. Saldo disponible: $${this.saldo.toLocaleString('es-CO')} USD, Monto solicitado: $${valor.toLocaleString('es-CO')} USD.`,
      };
    }

    // 1. Regla oficial: Calcula y aplica rendimiento del 1.5% mensual en el retiro
    const rendimiento = this.aplicarInteres();

    // 2. Debita el valor del retiro
    this._setSaldo(this.saldo - valor);
    this.agregarMovimiento('RETIRO', valor);

    return {
      exito: true,
      mensaje: `Retiro exitoso de $${valor.toLocaleString('es-CO')} USD. Rendimiento acreditado del 1.5%: +$${rendimiento.toLocaleString('es-CO')} USD. Nuevo saldo: $${this.saldo.toLocaleString('es-CO')} USD.`,
      detalles: {
        rendimientoAcreditado: rendimiento,
        saldoFinal: this.saldo,
      },
    };
  }
}
