/**
 * @file Cuenta.js
 * @description Superclase Abstracta Cuenta según el Diagrama UML de &rys Bank
 * Pilares POO: Abstracción, Encapsulamiento, Jerarquía de Herencia y Contrato Polimórfico
 */

import { Movimiento } from './Movimiento.js';

export class Cuenta {
  // Atributos protegidos/privados (#) según Diagrama UML
  #numeroCuenta;
  #saldo;
  #tipo;
  #movimientos;

  /**
   * @param {string} numeroCuenta - Identificador único de la cuenta
   * @param {number} saldoInicial - Saldo inicial aperturado
   * @param {string} tipo - Tipo de producto ('Ahorros', 'Corriente', 'Tarjeta de Crédito')
   */
  constructor(numeroCuenta, saldoInicial = 0, tipo = 'Cuenta') {
    if (new.target === Cuenta) {
      throw new TypeError("No se puede instanciar directamente la clase abstracta Cuenta. Usa una subclase (CuentaAhorros, CuentaCorriente, TarjetaCredito).");
    }

    if (saldoInicial < 0) {
      throw new Error("El saldo inicial no puede ser negativo.");
    }

    this.#numeroCuenta = numeroCuenta;
    this.#saldo = Math.round(Number(saldoInicial) * 100) / 100;
    this.#tipo = tipo;
    this.#movimientos = []; // Estructura List<Movimiento> en JavaScript (Array)

    if (saldoInicial > 0) {
      this.agregarMovimiento('APERTURA_CONSIGNACION', saldoInicial);
    }
  }

  // --- Getters y Setters Encapsulados ---
  get numeroCuenta() {
    return this.#numeroCuenta;
  }

  get saldo() {
    return this.#saldo;
  }

  // Modificador protegido para las subclases
  _setSaldo(nuevoSaldo) {
    this.#saldo = Math.round(nuevoSaldo * 100) / 100;
  }

  get tipo() {
    return this.#tipo;
  }

  get movimientos() {
    // Retorna una copia de la lista ordenada por fecha descendente
    return [...this.#movimientos].sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime());
  }

  /**
   * Método público (+) según Diagrama UML: consultarSaldo() float
   * @returns {number} Saldo actual disponible
   */
  consultarSaldo() {
    return this.#saldo;
  }

  /**
   * Método público (+) según Diagrama UML: consignar(float monto)
   * Validación: número positivo mayor a cero
   * @param {number} monto
   * @returns {{ exito: boolean, mensaje: string }}
   */
  consignar(monto) {
    const valor = Number(monto);
    if (isNaN(valor) || valor <= 0) {
      return {
        exito: false,
        mensaje: "Validación: El monto a consignar debe ser un número positivo mayor a cero.",
      };
    }

    this._setSaldo(this.#saldo + valor);
    this.agregarMovimiento('CONSIGNACION', valor);

    return {
      exito: true,
      mensaje: `Consignación exitosa por $${valor.toLocaleString('es-CO')} USD. Nuevo saldo: $${this.#saldo.toLocaleString('es-CO')} USD.`,
    };
  }

  /**
   * Método público (+) abstracto según Diagrama UML: retirar(float monto)
   * POLIMORFISMO: Cada subclase implementa sus propias reglas de negocio:
   * - CuentaAhorros: Tasa mensual 1.5% aplicada al retirar, no puede superar saldo disponible.
   * - CuentaCorriente: Sobregiro del 20% adicional sobre el saldo base.
   * - TarjetaCredito: Dispone del cupo y calcula amortización mensual.
   * @param {number} monto
   * @returns {{ exito: boolean, mensaje: string, detalles?: object }}
   */
  retirar(monto) {
    throw new Error("El método retirar(monto) debe ser implementado polimórficamente por las subclases.");
  }

  /**
   * Método público (+) según Diagrama UML: transferir(Cuenta destino, float monto)
   * Restricción: No se permiten transferencias al mismo producto
   * @param {Cuenta} cuentaDestino
   * @param {number} monto
   * @returns {{ exito: boolean, mensaje: string }}
   */
  transferir(cuentaDestino, monto) {
    if (!cuentaDestino || !(cuentaDestino instanceof Cuenta)) {
      return { exito: false, mensaje: "Cuenta de destino inválida." };
    }

    // Regla de Negocio Obligatoria: No al mismo producto
    if (this.numeroCuenta === cuentaDestino.numeroCuenta) {
      return {
        exito: false,
        mensaje: "Restricción bancaria: No se permiten transferencias al mismo producto.",
      };
    }

    const valor = Number(monto);
    if (isNaN(valor) || valor <= 0) {
      return { exito: false, mensaje: "El monto a transferir debe ser mayor a cero." };
    }

    // Efectuamos el débito llamando al método polimórfico retirar()
    const debito = this.retirar(valor);
    if (!debito.exito) {
      return debito; // Fondos insuficientes o límite de sobregiro superado
    }

    // Acreditamos en la cuenta de destino
    cuentaDestino.consignar(valor);

    // Registramos en ambos historiales
    this.agregarMovimiento('TRANSFERENCIA_ENVIADA', valor);
    cuentaDestino.agregarMovimiento('TRANSFERENCIA_RECIBIDA', valor);

    return {
      exito: true,
      mensaje: `Transferencia exitosa de $${valor.toLocaleString('es-CO')} USD a la cuenta ${cuentaDestino.numeroCuenta}.`,
    };
  }

  /**
   * Método público (+) según Diagrama UML: agregarMovimiento(String tipo, float valor)
   * @param {string} tipo
   * @param {number} valor
   */
  agregarMovimiento(tipo, valor) {
    const mov = new Movimiento(tipo, valor);
    this.#movimientos.unshift(mov);
  }
}
