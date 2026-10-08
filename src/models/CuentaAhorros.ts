/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CuentaAhorros - Subclase de Cuenta (Herencia y Polimorfismo)
 * 
 * Reglas de Negocio Oficiales:
 * - Propósito: Guardar dinero a mediano y largo plazo con rendimientos seguros.
 * - Operaciones: Consignación y retiro.
 * - Generación de intereses: Tasa mensual del 1.5%, calculada y aplicada en el momento del retiro.
 * - Restricción: El monto a retirar NO puede superar el saldo disponible.
 */

import { Cuenta, OperacionResultado } from './Cuenta';
import { Transaccion } from './Transaccion';

export class CuentaAhorros extends Cuenta {
  // Encapsulamiento de la tasa fija de rendimientos
  readonly #tasaInteresMensual: number = 0.015; // 1.5% mensual
  #interesesAcumuladosTotales: number = 0;

  constructor(numeroCuenta: string, saldoInicial: number, titularId: string, titularNombre: string) {
    super(numeroCuenta, saldoInicial, titularId, titularNombre);
  }

  get tasaInteresMensual(): number {
    return this.#tasaInteresMensual;
  }

  get interesesAcumuladosTotales(): number {
    return this.#interesesAcumuladosTotales;
  }

  // --- POLIMORFISMO: Implementación de retirar() para Cuenta de Ahorros ---
  retirar(monto: number, descripcion: string = 'Retiro en cajero / transferencia'): OperacionResultado {
    if (monto <= 0) {
      return {
        exito: false,
        mensaje: "El monto a retirar debe ser mayor a cero.",
        saldoAnterior: this.saldo,
        saldoNuevo: this.saldo,
      };
    }

    const saldoBase = this.saldo;

    // Regla de Negocio: El monto no puede superar el saldo disponible
    if (monto > saldoBase) {
      return {
        exito: false,
        mensaje: `Fondos insuficientes en Cuenta de Ahorros. Monto solicitado: $${monto.toLocaleString('es-CO')} COP, Saldo disponible: $${saldoBase.toLocaleString('es-CO')} COP.`,
        saldoAnterior: saldoBase,
        saldoNuevo: saldoBase,
      };
    }

    // Regla de Negocio: Generación de intereses (1.5% mensual) calculada y aplicada en el momento del retiro
    const rendimiento = Math.round(saldoBase * this.#tasaInteresMensual * 100) / 100;
    this.#interesesAcumuladosTotales += rendimiento;

    // Se acredita el rendimiento generado antes de procesar el egreso
    const saldoConInteres = Math.round((saldoBase + rendimiento) * 100) / 100;
    this.setSaldo(saldoConInteres);

    // Registro de la transacción de rendimiento ganado
    const txInteres = new Transaccion({
      tipo: 'RENDIMIENTO_INTERES',
      monto: rendimiento,
      saldoPosterior: saldoConInteres,
      descripcion: `Rendimiento de Ahorros liquidado (1.50% mensual aplicado sobre saldo de $${saldoBase.toLocaleString('es-CO')})`,
      categoria: 'Inversión',
      detalles: {
        tasaInteres: this.#tasaInteresMensual,
        interesGenerado: rendimiento,
      },
    });
    this.registrarMovimiento(txInteres);

    // Ahora se debita el retiro autorizado
    const saldoFinal = Math.round((saldoConInteres - monto) * 100) / 100;
    this.setSaldo(saldoFinal);

    const txRetiro = new Transaccion({
      tipo: 'RETIRO',
      monto,
      saldoPosterior: saldoFinal,
      descripcion,
      categoria: 'Gasto',
      detalles: {
        interesGenerado: rendimiento,
      },
    });
    this.registrarMovimiento(txRetiro);

    return {
      exito: true,
      mensaje: `Retiro exitoso de $${monto.toLocaleString('es-CO')} COP. Se liquidó a tu favor un rendimiento del 1.5% (+$${rendimiento.toLocaleString('es-CO')} COP). Nuevo saldo: $${saldoFinal.toLocaleString('es-CO')} COP.`,
      saldoAnterior: saldoBase,
      saldoNuevo: saldoFinal,
      transaccion: txRetiro,
      detalles: {
        rendimientoLiquidado: rendimiento,
        saldoPrevio: saldoBase,
        saldoFinal,
      },
    };
  }

  // Polimorfismo: Límite de retiro es exactamente el saldo disponible
  calcularLimiteRetiro(): number {
    return this.saldo;
  }

  obtenerTipo(): 'AHORROS' {
    return 'AHORROS';
  }

  obtenerNombreComercial(): string {
    return 'Cuenta de Ahorros Rendimiento';
  }

  obtenerResumenProducto(): Record<string, any> {
    return {
      tipo: 'AHORROS',
      nombre: 'Cuenta de Ahorros',
      tasaMensual: '1.50%',
      tasaEA: '19.56% E.A.',
      saldoDisponible: this.saldo,
      limiteRetiro: this.calcularLimiteRetiro(),
      interesesHistoricos: this.#interesesAcumuladosTotales,
      sobregiroPermitido: false,
    };
  }

  // Simulador de crecimiento financiero con interés compuesto para la UI
  simularCrecimiento(monto: number, meses: number): { capitalFinal: number; interesesTotales: number; historial: { mes: number; saldo: number }[] } {
    let saldo = monto;
    const historial = [{ mes: 0, saldo }];
    for (let i = 1; i <= meses; i++) {
      saldo += saldo * this.#tasaInteresMensual;
      historial.push({ mes: i, saldo: Math.round(saldo * 100) / 100 });
    }
    const capitalFinal = Math.round(saldo * 100) / 100;
    return {
      capitalFinal,
      interesesTotales: Math.round((capitalFinal - monto) * 100) / 100,
      historial,
    };
  }
}
