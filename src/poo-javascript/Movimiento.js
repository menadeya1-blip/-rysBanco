/**
 * @file Movimiento.js
 * @description Clase Movimiento según el Diagrama UML de &rys Bank
 * Pilar POO: Abstracción y Encapsulamiento
 */

export class Movimiento {
  // Atributos privados (-) según Diagrama UML
  #fechaHora;
  #tipo;
  #valor;

  /**
   * @param {string} tipo - Tipo de movimiento ('CONSIGNACION', 'RETIRO', 'TRANSFERENCIA', 'COMPRA', 'INTERES')
   * @param {number} valor - Monto monetario de la operación
   * @param {Date} [fechaHora] - Fecha y hora del registro (por defecto: ahora)
   */
  constructor(tipo, valor, fechaHora = new Date()) {
    if (valor <= 0) {
      throw new Error("El valor del movimiento debe ser mayor a cero.");
    }
    this.#fechaHora = fechaHora instanceof Date ? fechaHora : new Date(fechaHora);
    this.#tipo = tipo;
    this.#valor = Math.round(Number(valor) * 100) / 100;
  }

  // Getters para acceso controlado (Encapsulamiento)
  get fechaHora() {
    return this.#fechaHora;
  }

  get tipo() {
    return this.#tipo;
  }

  get valor() {
    return this.#valor;
  }

  /**
   * Método público (+) según Diagrama UML
   * @returns {string} Resumen formateado del movimiento
   */
  obtenerDetalle() {
    const fechaStr = this.#fechaHora.toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    return `[${fechaStr}] ${this.#tipo}: $${this.#valor.toLocaleString('es-CO')} USD`;
  }

  // Serialización para persistencia en JSON / localStorage
  toJSON() {
    return {
      fechaHora: this.#fechaHora.toISOString(),
      tipo: this.#tipo,
      valor: this.#valor,
    };
  }

  static fromJSON(json) {
    return new Movimiento(json.tipo, json.valor, new Date(json.fechaHora));
  }
}
