/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CuentaCorriente - Subclase de Cuenta (Herencia y Polimorfismo)
 * 
 * Reglas de Negocio Oficiales:
 * - Propósito: Gestión diaria del dinero con mayor flexibilidad, nómina, transferencias.
 * - No genera intereses.
 * - Sobregiro permitido: El cliente puede retirar hasta un 20% adicional sobre su saldo actual.
 *   Ejemplo oficial: Con saldo de $1.000.000, el límite de retiro es $1.200.000.
 */

import { Cuenta, OperacionResultado } from './Cuenta';
import { Transaccion } from './Transaccion';

export class CuentaCorriente extends Cuenta {
  // Encapsulamiento del porcentaje de sobregiro operativo (20%)
  readonly #porcentajeSobregiro: number = 0.20;
  #sobregiroUtilizado: number = 0;

  constructor(numeroCuenta: string, saldoInicial: number, titularId: string, titularNombre: string) {
    super(numeroCuenta, saldoInicial, titularId, titularNombre);
  }

  get porcentajeSobregiro(): number {
    return this.#porcentajeSobregiro;
  }

  get sobregiroUtilizado(): number {
    return this.#sobregiroUtilizado;
  }

  // Límite máximo de retiro permitido según el saldo actual (Saldo + 20% adicional)
  calcularLimiteRetiro(): number {
    if (this.saldo > 0) {
      return Math.round(this.saldo * (1 + this.#porcentajeSobregiro) * 100) / 100;
    }
    // Si ya está en saldo negativo / sobregiro utilizado, no hay margen adicional hasta consignar
    return 0;
  }

  // Cupo de sobregiro en dólares según el saldo positivo actual
  calcularCupoSobregiro(): number {
    return this.saldo > 0 ? Math.round(this.saldo * this.#porcentajeSobregiro * 100) / 100 : 0;
  }

  // --- POLIMORFISMO: Implementación de retirar() con regla de Sobregiro del 20% ---
  retirar(monto: number, descripcion: string = 'Retiro / Débito Cuenta Corriente'): OperacionResultado {
    if (monto <= 0) {
      return {
        exito: false,
        mensaje: "El monto a debitar debe ser mayor a cero.",
        saldoAnterior: this.saldo,
        saldoNuevo: this.saldo,
      };
    }

    const saldoAnterior = this.saldo;
    const limitePermitido = this.calcularLimiteRetiro();

    // Verificación contra la regla de negocio: Saldo + 20% de sobregiro
    if (monto > limitePermitido) {
      return {
        exito: false,
        mensaje: `El monto de $${monto.toLocaleString('es-CO')} COP excede el límite máximo permitido de retiro ($${limitePermitido.toLocaleString('es-CO')} COP) que incluye tu saldo ($${saldoAnterior.toLocaleString('es-CO')} COP) más el 20% de sobregiro ($${this.calcularCupoSobregiro().toLocaleString('es-CO')} COP).`,
        saldoAnterior,
        saldoNuevo: saldoAnterior,
      };
    }

    // Procesa el retiro (puede usar fondos propios o entrar en sobregiro operativo)
    const saldoNuevo = Math.round((saldoAnterior - monto) * 100) / 100;
    let sobregiroUsadoEnTx = 0;

    if (monto > saldoAnterior) {
      sobregiroUsadoEnTx = Math.round((monto - saldoAnterior) * 100) / 100;
      this.#sobregiroUtilizado += sobregiroUsadoEnTx;
    }

    this.setSaldo(saldoNuevo);

    const tx = new Transaccion({
      tipo: 'RETIRO',
      monto,
      saldoPosterior: saldoNuevo,
      descripcion: sobregiroUsadoEnTx > 0 
        ? `${descripcion} (Incluye sobregiro operativo de $${sobregiroUsadoEnTx.toLocaleString('es-CO')})`
        : descripcion,
      categoria: 'Gasto',
      detalles: {
        sobregiroUsado: sobregiroUsadoEnTx,
      },
    });

    this.registrarMovimiento(tx);

    const mensajeExito = sobregiroUsadoEnTx > 0
      ? `Retiro exitoso de $${monto.toLocaleString('es-CO')} COP. Se utilizó $${sobregiroUsadoEnTx.toLocaleString('es-CO')} COP de tu sobregiro del 20%. Saldo actual: $${saldoNuevo.toLocaleString('es-CO')} COP.`
      : `Retiro exitoso de $${monto.toLocaleString('es-CO')} COP. Saldo disponible restante: $${saldoNuevo.toLocaleString('es-CO')} COP.`;

    return {
      exito: true,
      mensaje: mensajeExito,
      saldoAnterior,
      saldoNuevo,
      transaccion: tx,
      detalles: {
        sobregiroUsado: sobregiroUsadoEnTx,
        limiteAnterior: limitePermitido,
      },
    };
  }

  // Sobrecarga de consignar para registrar la amortización de sobregiro si correspondía
  consignar(monto: number, descripcion: string = 'Depósito en Cuenta Corriente'): OperacionResultado {
    const res = super.consignar(monto, descripcion);
    if (res.exito && this.saldo >= 0 && this.#sobregiroUtilizado > 0) {
      this.#sobregiroUtilizado = 0;
    }
    return res;
  }

  obtenerTipo(): 'CORRIENTE' {
    return 'CORRIENTE';
  }

  obtenerNombreComercial(): string {
    return 'Cuenta Corriente Flexible';
  }

  obtenerResumenProducto(): Record<string, any> {
    return {
      tipo: 'CORRIENTE',
      nombre: 'Cuenta Corriente',
      saldo: this.saldo,
      porcentajeSobregiro: '20%',
      cupoSobregiroDisponible: this.calcularCupoSobregiro(),
      limiteTotalRetiro: this.calcularLimiteRetiro(),
      sobregiroActualmenteUtilizado: this.#sobregiroUtilizado,
      intereses: 'No genera intereses (Mayor liquidez)',
    };
  }
}
