/**
 * @file CuentaCorriente.js
 * @description Subclase CuentaCorriente según el Diagrama UML de &rys Bank
 * Pilares POO: Herencia (extends Cuenta), Encapsulamiento (#) y Polimorfismo (retirar con sobregiro 20%)
 * 
 * Reglas de Negocio Oficiales:
 * - Propósito: Gestión diaria del dinero con mayor flexibilidad, nómina, transferencias.
 * - No genera intereses.
 * - Sobregiro permitido: El cliente puede retirar hasta un 20% adicional sobre su saldo actual.
 *   Ejemplo oficial: Con saldo de $1.000.000, el límite de retiro es $1.200.000.
 */

import { Cuenta } from './Cuenta.js';

export class CuentaCorriente extends Cuenta {
  // Atributo privado (-) según Diagrama UML
  #porcentajeSobregiro;

  /**
   * @param {string} numeroCuenta
   * @param {number} saldoInicial
   * @param {number} [porcentajeSobregiro=0.20] - Sobregiro del 20% adicional
   */
  constructor(numeroCuenta, saldoInicial = 0, porcentajeSobregiro = 0.20) {
    super(numeroCuenta, saldoInicial, 'Cuenta Corriente');
    this.#porcentajeSobregiro = Number(porcentajeSobregiro);
  }

  get porcentajeSobregiro() {
    return this.#porcentajeSobregiro;
  }

  /**
   * Límite de retiro permitido: Saldo + 20% adicional de sobregiro
   * @returns {number}
   */
  calcularLimiteRetiro() {
    if (this.saldo > 0) {
      return Math.round(this.saldo * (1 + this.#porcentajeSobregiro) * 100) / 100;
    }
    return 0;
  }

  /**
   * POLIMORFISMO: Sobrescritura de retirar(float monto) según Diagrama UML
   * Regla de negocio: Permite retirar hasta saldo + 20% de sobregiro
   * @param {number} monto
   * @returns {{ exito: boolean, mensaje: string, detalles?: object }}
   */
  retirar(monto) {
    const valor = Number(monto);
    if (isNaN(valor) || valor <= 0) {
      return { exito: false, mensaje: "El monto a debitar debe ser mayor a cero." };
    }

    const saldoAnterior = this.saldo;
    const limitePermitido = this.calcularLimiteRetiro();

    // Verificación contra la regla de negocio del sobregiro (Saldo * 1.20)
    if (valor > limitePermitido) {
      return {
        exito: false,
        mensaje: `El monto solicitado ($${valor.toLocaleString('es-CO')} USD) supera el límite máximo permitido ($${limitePermitido.toLocaleString('es-CO')} USD) que incluye tu saldo ($${saldoAnterior.toLocaleString('es-CO')} USD) más el 20% de sobregiro.`,
      };
    }

    // Calcula si se utilizó sobregiro
    const nuevoSaldo = Math.round((saldoAnterior - valor) * 100) / 100;
    const sobregiroUsado = valor > saldoAnterior ? Math.round((valor - saldoAnterior) * 100) / 100 : 0;

    this._setSaldo(nuevoSaldo);
    this.agregarMovimiento(
      sobregiroUsado > 0 ? 'RETIRO_CON_SOBREGIRO' : 'RETIRO',
      valor
    );

    const msj = sobregiroUsado > 0
      ? `Retiro exitoso de $${valor.toLocaleString('es-CO')} USD. Se utilizó $${sobregiroUsado.toLocaleString('es-CO')} USD de tu sobregiro del 20%. Saldo actual: $${nuevoSaldo.toLocaleString('es-CO')} USD.`
      : `Retiro exitoso de $${valor.toLocaleString('es-CO')} USD. Saldo restante: $${nuevoSaldo.toLocaleString('es-CO')} USD.`;

    return {
      exito: true,
      mensaje: msj,
      detalles: {
        saldoAnterior,
        saldoNuevo: nuevoSaldo,
        sobregiroUsado,
      },
    };
  }
}
