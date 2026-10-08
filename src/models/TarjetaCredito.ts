/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * TarjetaCredito - Subclase de Cuenta (Herencia y Polimorfismo)
 * 
 * Reglas de Negocio Oficiales:
 * - Funcionamiento: El banco asigna un cupo de crédito; cada compra genera una deuda a pagar.
 * - Cada transacción debe mostrar el valor del pago mensual resultante.
 * - Tabla de tasas de interés aplicables:
 *   <= 2 cuotas: 0% mensual (Sin interés)
 *   3 a 6 cuotas: 1.9% mensual (Interés moderado)
 *   >= 7 cuotas: 2.3% mensual (Interés alto)
 * - Fórmula matemática estricta:
 *   Cuota mensual = (Capital * tasa) / (1 - (1 + tasa)^(-n))
 *   (Donde tasa = tasa mensual decimal, n = número de cuotas)
 */

import { Cuenta, OperacionResultado } from './Cuenta';
import { Transaccion } from './Transaccion';

export interface CalculoCuotaDetalle {
  capital: number;
  cuotas: number;
  tasaMensualDecimal: number;
  tasaMensualPorcentaje: string;
  cuotaMensual: number;
  totalPagar: number;
  interesesTotales: number;
}

export class TarjetaCredito extends Cuenta {
  // Atributos privados encapsulados
  #cupoTotal: number;
  #deudaActual: number = 0;
  #numeroTarjetaVisible: string;
  #fechaVencimiento: string;
  #marca: string = 'Obsidian Metal NFC Core 3.0';

  constructor(
    numeroCuenta: string,
    cupoTotal: number,
    titularId: string,
    titularNombre: string,
    numeroTarjetaVisible?: string,
    fechaVencimiento?: string
  ) {
    // En la jerarquía de Cuenta, inicializamos con el cupo disponible como saldo inicial representativo
    super(numeroCuenta, cupoTotal, titularId, titularNombre);
    this.#cupoTotal = cupoTotal;
    this.#numeroTarjetaVisible = numeroTarjetaVisible || `4532 •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`;
    this.#fechaVencimiento = fechaVencimiento || '11/29';
  }

  get cupoTotal(): number {
    return this.#cupoTotal;
  }

  get deudaActual(): number {
    return this.#deudaActual;
  }

  get cupoDisponible(): number {
    return Math.max(0, Math.round((this.#cupoTotal - this.#deudaActual) * 100) / 100);
  }

  get numeroTarjetaVisible(): string {
    return this.#numeroTarjetaVisible;
  }

  get fechaVencimiento(): string {
    return this.#fechaVencimiento;
  }

  get marca(): string {
    return this.#marca;
  }

  // --- REGLA DE NEGOCIO: Determinación de la Tasa de Interés según el número de cuotas ---
  obtenerTasaMensual(cuotas: number): number {
    if (cuotas <= 2) {
      return 0.0; // <= 2 cuotas: 0% mensual (Sin interés)
    } else if (cuotas <= 6) {
      return 0.019; // 3-6 cuotas: 1.9% mensual
    } else {
      return 0.023; // >= 7 cuotas: 2.3% mensual
    }
  }

  // --- REGLA DE NEGOCIO: Fórmula de Cuota Mensual ---
  // Cuota mensual = (Capital * tasa) / (1 - (1 + tasa)^(-n))
  calcularCuotaMensual(capital: number, cuotas: number): CalculoCuotaDetalle {
    if (capital <= 0 || cuotas < 1) {
      return {
        capital,
        cuotas,
        tasaMensualDecimal: 0,
        tasaMensualPorcentaje: '0.0%',
        cuotaMensual: 0,
        totalPagar: 0,
        interesesTotales: 0,
      };
    }

    const n = Math.floor(cuotas);
    const tasa = this.obtenerTasaMensual(n);

    let cuotaMensual = 0;
    let totalPagar = 0;

    if (tasa === 0) {
      // 0% de interés para 1 o 2 cuotas
      cuotaMensual = capital / n;
      totalPagar = capital;
    } else {
      // Fórmula estándar financiera de amortización francesa:
      // Cuota = (Capital * i) / (1 - (1 + i)^-n)
      const factor = Math.pow(1 + tasa, -n);
      cuotaMensual = (capital * tasa) / (1 - factor);
      totalPagar = cuotaMensual * n;
    }

    cuotaMensual = Math.round(cuotaMensual * 100) / 100;
    totalPagar = Math.round(totalPagar * 100) / 100;
    const interesesTotales = Math.round((totalPagar - capital) * 100) / 100;

    return {
      capital,
      cuotas: n,
      tasaMensualDecimal: tasa,
      tasaMensualPorcentaje: `${(tasa * 100).toFixed(1)}%`,
      cuotaMensual,
      totalPagar,
      interesesTotales,
    };
  }

  // Realizar una compra con tarjeta a cuotas
  realizarCompra(monto: number, cuotas: number, establecimiento: string = 'Comercio General'): OperacionResultado {
    if (monto <= 0) {
      return {
        exito: false,
        mensaje: "El valor de la compra debe ser mayor a cero.",
        saldoAnterior: this.cupoDisponible,
        saldoNuevo: this.cupoDisponible,
      };
    }

    if (cuotas < 1) {
      return {
        exito: false,
        mensaje: "El número de cuotas debe ser al menos 1.",
        saldoAnterior: this.cupoDisponible,
        saldoNuevo: this.cupoDisponible,
      };
    }

    const cupoAntes = this.cupoDisponible;

    // Validación de cupo de crédito asignado
    if (monto > cupoAntes) {
      return {
        exito: false,
        mensaje: `Transacción rechazada. Cupo insuficiente. Monto de compra: $${monto.toLocaleString('es-CO')} COP, Cupo disponible: $${cupoAntes.toLocaleString('es-CO')} COP.`,
        saldoAnterior: cupoAntes,
        saldoNuevo: cupoAntes,
      };
    }

    // Cálculo financiero de cuota y tasa
    const calculo = this.calcularCuotaMensual(monto, cuotas);

    // Actualiza deuda y cupo disponible
    this.#deudaActual = Math.round((this.#deudaActual + monto) * 100) / 100;
    const cupoDespues = this.cupoDisponible;
    this.setSaldo(cupoDespues);

    const tx = new Transaccion({
      tipo: 'COMPRA_CREDITO',
      monto,
      saldoPosterior: cupoDespues,
      descripcion: `Compra en ${establecimiento} diferida a ${cuotas} cuota(s)`,
      categoria: 'Crédito',
      detalles: {
        comercio: establecimiento,
        cuotas,
        tasaInteres: calculo.tasaMensualDecimal,
        cuotaMensual: calculo.cuotaMensual,
      },
    });

    this.registrarMovimiento(tx);

    const mensajeTasa = calculo.tasaMensualDecimal === 0
      ? '0% interés (Promoción 1-2 cuotas)'
      : `${calculo.tasaMensualPorcentaje} mensual`;

    return {
      exito: true,
      mensaje: `Compra aprobada por $${monto.toLocaleString('es-CO')} COP en ${establecimiento}. Cuota mensual estimada: $${calculo.cuotaMensual.toLocaleString('es-CO')} COP (${cuotas} cuota(s) a ${mensajeTasa}). Cupo disponible: $${cupoDespues.toLocaleString('es-CO')} COP.`,
      saldoAnterior: cupoAntes,
      saldoNuevo: cupoDespues,
      transaccion: tx,
      detalles: calculo,
    };
  }

  // --- POLIMORFISMO: Implementación de retirar() como avance de efectivo con tarjeta ---
  retirar(monto: number, descripcion: string = 'Avance en efectivo con Tarjeta de Crédito'): OperacionResultado {
    // Por defecto, un avance de efectivo se difiere a 12 cuotas con tasa de 2.3%
    const cuotas = 12;
    if (monto > this.cupoDisponible) {
      return {
        exito: false,
        mensaje: `Cupo de tarjeta insuficiente para avance. Cupo libre: $${this.cupoDisponible.toLocaleString('es-CO')} COP.`,
        saldoAnterior: this.cupoDisponible,
        saldoNuevo: this.cupoDisponible,
      };
    }

    const calculo = this.calcularCuotaMensual(monto, cuotas);
    const cupoAntes = this.cupoDisponible;
    this.#deudaActual = Math.round((this.#deudaActual + monto) * 100) / 100;
    const cupoDespues = this.cupoDisponible;
    this.setSaldo(cupoDespues);

    const tx = new Transaccion({
      tipo: 'RETIRO',
      monto,
      saldoPosterior: cupoDespues,
      descripcion: `${descripcion} (Diferido a ${cuotas} cuotas a tasa 2.3%)`,
      categoria: 'Crédito',
      detalles: {
        cuotas,
        tasaInteres: 0.023,
        cuotaMensual: calculo.cuotaMensual,
      },
    });
    this.registrarMovimiento(tx);

    return {
      exito: true,
      mensaje: `Avance exitoso de $${monto.toLocaleString('es-CO')} COP. Cuota mensual: $${calculo.cuotaMensual.toLocaleString('es-CO')} COP. Cupo restante: $${cupoDespues.toLocaleString('es-CO')} COP.`,
      saldoAnterior: cupoAntes,
      saldoNuevo: cupoDespues,
      transaccion: tx,
      detalles: calculo,
    };
  }

  // Pago de la tarjeta de crédito (abono a capital/deuda que restaura cupo)
  pagarTarjeta(monto: number, descripcion: string = 'Pago de tarjeta de crédito'): OperacionResultado {
    if (monto <= 0) {
      return {
        exito: false,
        mensaje: "El monto a pagar debe ser positivo.",
        saldoAnterior: this.cupoDisponible,
        saldoNuevo: this.cupoDisponible,
      };
    }

    if (this.#deudaActual === 0) {
      return {
        exito: false,
        mensaje: "La tarjeta de crédito no tiene deuda pendiente actualmente.",
        saldoAnterior: this.cupoDisponible,
        saldoNuevo: this.cupoDisponible,
      };
    }

    const montoEfectivo = Math.min(monto, this.#deudaActual);
    const cupoAntes = this.cupoDisponible;
    this.#deudaActual = Math.round((this.#deudaActual - montoEfectivo) * 100) / 100;
    const cupoDespues = this.cupoDisponible;
    this.setSaldo(cupoDespues);

    const tx = new Transaccion({
      tipo: 'PAGO_TARJETA',
      monto: montoEfectivo,
      saldoPosterior: cupoDespues,
      descripcion,
      categoria: 'Crédito',
    });
    this.registrarMovimiento(tx);

    return {
      exito: true,
      mensaje: `Pago acreditado por $${montoEfectivo.toLocaleString('es-CO')} COP. Deuda restante: $${this.#deudaActual.toLocaleString('es-CO')} COP. Cupo libre: $${cupoDespues.toLocaleString('es-CO')} COP.`,
      saldoAnterior: cupoAntes,
      saldoNuevo: cupoDespues,
      transaccion: tx,
    };
  }

  // Polimorfismo: En tarjeta de crédito, consignar equivale a realizar un pago de la tarjeta
  consignar(monto: number, descripcion: string = 'Abono / Pago de Tarjeta'): OperacionResultado {
    return this.pagarTarjeta(monto, descripcion);
  }

  calcularLimiteRetiro(): number {
    return this.cupoDisponible;
  }

  obtenerTipo(): 'TARJETA_CREDITO' {
    return 'TARJETA_CREDITO';
  }

  obtenerNombreComercial(): string {
    return 'Tarjeta Obsidian Metal';
  }

  obtenerResumenProducto(): Record<string, any> {
    return {
      tipo: 'TARJETA_CREDITO',
      nombre: 'Tarjeta de Crédito Obsidian Metal',
      cupoTotal: this.#cupoTotal,
      deudaActual: this.#deudaActual,
      cupoDisponible: this.cupoDisponible,
      tasas: {
        hasta2Cuotas: '0% (Sin interés)',
        de3a6Cuotas: '1.9% mensual',
        desde7Cuotas: '2.3% mensual',
      },
      numeroTarjeta: this.#numeroTarjetaVisible,
      vencimiento: this.#fechaVencimiento,
    };
  }
}
