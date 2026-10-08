/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Entidad Cliente - Pilares de Abstracción y Encapsulamiento
 */

import { Cuenta, OperacionResultado } from './Cuenta';
import { CuentaAhorros } from './CuentaAhorros';
import { CuentaCorriente } from './CuentaCorriente';
import { TarjetaCredito } from './TarjetaCredito';
import { Transaccion } from './Transaccion';

export interface NotificacionBancaria {
  id: string;
  titulo: string;
  mensaje: string;
  monto?: number;
  tipo: 'TRANSACCION' | 'SEGURIDAD' | 'RECOMPENSA' | 'SISTEMA';
  leida: boolean;
  fecha: Date;
  categoriaTag?: string;
  estadoBadge?: string;
  meta?: Record<string, any>;
}

export class Cliente {
  // Atributos privados encapsulados
  #id: string;
  #identificacion: string;
  #nombreCompleto: string;
  #celular: string;
  #email: string;
  #username: string;
  #password: string;
  #cuentas: Map<string, Cuenta> = new Map();
  #intentosFallidos: number = 0;
  #bloqueado: boolean = false;
  #fechaRegistro: Date;
  #notificaciones: NotificacionBancaria[] = [];
  #tier: string = 'Private Wealth • Nivel Diamante';

  static readonly MAX_INTENTOS_FALLIDOS = 3;

  constructor(params: {
    identificacion: string;
    nombreCompleto: string;
    celular: string;
    username: string;
    password: string;
    email?: string;
    id?: string;
    tier?: string;
    fechaRegistro?: Date;
  }) {
    if (!params.identificacion || !params.nombreCompleto || !params.username || !params.password) {
      throw new Error("Datos incompletos para crear el cliente.");
    }
    this.#id = params.id || `CLI-${Math.floor(100000 + Math.random() * 900000)}`;
    this.#identificacion = params.identificacion.trim();
    this.#nombreCompleto = params.nombreCompleto.trim();
    this.#celular = params.celular.trim();
    this.#username = params.username.toLowerCase().trim();
    this.#password = params.password;
    this.#email = params.email || `${this.#username}@rysbank.com`;
    this.#tier = params.tier || 'Private Wealth • Nivel Diamante';
    this.#fechaRegistro = params.fechaRegistro || new Date();
  }

  // --- GETTERS ENCAPSULADOS ---
  get id(): string { return this.#id; }
  get identificacion(): string { return this.#identificacion; }
  get nombreCompleto(): string { return this.#nombreCompleto; }
  get celular(): string { return this.#celular; }
  get email(): string { return this.#email; }
  get username(): string { return this.#username; }
  get intentosFallidos(): number { return this.#intentosFallidos; }
  get bloqueado(): boolean { return this.#bloqueado; }
  get fechaRegistro(): Date { return this.#fechaRegistro; }
  get tier(): string { return this.#tier; }
  get notificaciones(): NotificacionBancaria[] { return [...this.#notificaciones]; }

  // Obtener todas las cuentas del cliente
  get cuentas(): Cuenta[] {
    return Array.from(this.#cuentas.values());
  }

  // Cuentas específicas por tipo
  get cuentaAhorros(): CuentaAhorros | undefined {
    return this.cuentas.find(c => c instanceof CuentaAhorros) as CuentaAhorros | undefined;
  }

  get cuentaCorriente(): CuentaCorriente | undefined {
    return this.cuentas.find(c => c instanceof CuentaCorriente) as CuentaCorriente | undefined;
  }

  get tarjetaCredito(): TarjetaCredito | undefined {
    return this.cuentas.find(c => c instanceof TarjetaCredito) as TarjetaCredito | undefined;
  }

  // Cálculo del patrimonio líquido total
  get patrimonioLiquidoTotal(): number {
    let total = 0;
    for (const c of this.cuentas) {
      if (c instanceof CuentaAhorros || c instanceof CuentaCorriente) {
        total += c.saldo;
      }
    }
    return Math.round(total * 100) / 100;
  }

  // Gestión de seguridad y autenticación
  validarPassword(clave: string): boolean {
    if (this.#bloqueado) {
      return false;
    }
    const esValida = this.#password === clave;
    if (esValida) {
      this.#intentosFallidos = 0;
    } else {
      this.#intentosFallidos++;
      if (this.#intentosFallidos >= Cliente.MAX_INTENTOS_FALLIDOS) {
        this.#bloqueado = true;
        this.agregarNotificacion({
          titulo: 'Alerta de Seguridad: Cuenta Bloqueada',
          mensaje: 'Se han superado los 3 intentos fallidos permitidos. Tu cuenta ha sido bloqueada preventivamente.',
          tipo: 'SEGURIDAD',
          categoriaTag: 'Bloqueo Preventivo',
          estadoBadge: 'Alerta',
        });
      }
    }
    return esValida;
  }

  desbloquear(): void {
    this.#bloqueado = false;
    this.#intentosFallidos = 0;
    this.agregarNotificacion({
      titulo: 'Cuenta Desbloqueada',
      mensaje: 'Tu cuenta ha sido desbloqueada exitosamente por el sistema de seguridad bancario.',
      tipo: 'SEGURIDAD',
      categoriaTag: 'Seguridad',
      estadoBadge: 'Resuelto',
    });
  }

  resetearIntentos(): void {
    this.#intentosFallidos = 0;
  }

  // Cambio de contraseña seguro
  cambiarPassword(claveActual: string, nuevaClave: string, confirmacionClave: string): { exito: boolean; mensaje: string } {
    if (this.#password !== claveActual) {
      return {
        exito: false,
        mensaje: "La contraseña actual ingresada es incorrecta.",
      };
    }

    if (nuevaClave.length < 6) {
      return {
        exito: false,
        mensaje: "La nueva contraseña debe tener al menos 6 caracteres.",
      };
    }

    if (nuevaClave !== confirmacionClave) {
      return {
        exito: false,
        mensaje: "La confirmación no coincide con la nueva contraseña.",
      };
    }

    if (nuevaClave === claveActual) {
      return {
        exito: false,
        mensaje: "La nueva contraseña debe ser diferente a la contraseña actual.",
      };
    }

    this.#password = nuevaClave;
    this.agregarNotificacion({
      titulo: 'Contraseña Actualizada',
      mensaje: 'La contraseña de acceso a tu banca digital fue modificada con éxito.',
      tipo: 'SEGURIDAD',
      categoriaTag: 'Seguridad',
      estadoBadge: 'Confirmado',
    });

    return {
      exito: true,
      mensaje: "Contraseña actualizada exitosamente.",
    };
  }

  // Actualización de datos del perfil
  actualizarPerfil(datos: { nombreCompleto?: string; celular?: string; identificacion?: string; email?: string }): { exito: boolean; mensaje: string } {
    if (datos.nombreCompleto) this.#nombreCompleto = datos.nombreCompleto.trim();
    if (datos.celular) this.#celular = datos.celular.trim();
    if (datos.identificacion) this.#identificacion = datos.identificacion.trim();
    if (datos.email) this.#email = datos.email.trim();

    return {
      exito: true,
      mensaje: "Datos de perfil actualizados correctamente.",
    };
  }

  // Administración de cuentas
  agregarCuenta(cuenta: Cuenta): void {
    this.#cuentas.set(cuenta.numeroCuenta, cuenta);
  }

  obtenerCuenta(numeroCuenta: string): Cuenta | undefined {
    return this.#cuentas.get(numeroCuenta);
  }

  // --- REGLAS DE TRANSFERENCIAS ---
  // 1. Transferencia entre productos del mismo cliente
  // 2. Restricción: ¡NO se permiten transferencias al mismo producto!
  transferirEntreProductos(
    numeroCuentaOrigen: string,
    numeroCuentaDestino: string,
    monto: number,
    descripcion: string = 'Transferencia entre mis productos'
  ): OperacionResultado {
    if (numeroCuentaOrigen === numeroCuentaDestino) {
      return {
        exito: false,
        mensaje: "Restricción bancaria: No se permiten transferencias al mismo producto de origen y destino.",
        saldoAnterior: 0,
        saldoNuevo: 0,
      };
    }

    const origen = this.obtenerCuenta(numeroCuentaOrigen);
    const destino = this.obtenerCuenta(numeroCuentaDestino);

    if (!origen || !destino) {
      return {
        exito: false,
        mensaje: "Una o ambas cuentas no pertenecen a tu portafolio.",
        saldoAnterior: 0,
        saldoNuevo: 0,
      };
    }

    if (monto <= 0) {
      return {
        exito: false,
        mensaje: "El monto a transferir debe ser mayor a cero.",
        saldoAnterior: origen.saldo,
        saldoNuevo: origen.saldo,
      };
    }

    // Si origen es Tarjeta de Crédito, no se permite como cuenta de débito ordinaria
    if (origen instanceof TarjetaCredito) {
      return {
        exito: false,
        mensaje: "No se pueden realizar transferencias directas debitando desde la Tarjeta de Crédito.",
        saldoAnterior: origen.saldo,
        saldoNuevo: origen.saldo,
      };
    }

    // Efectuar débito usando el método polimórfico retirar()
    const debitoResultado = origen.retirar(monto, `Transferencia a mi cuenta ${destino.obtenerNombreComercial()} (${destino.numeroCuenta})`);
    if (!debitoResultado.exito) {
      return debitoResultado;
    }

    // Efectuar crédito en destino usando consignar()
    let creditoResultado: OperacionResultado;
    if (destino instanceof TarjetaCredito) {
      creditoResultado = destino.pagarTarjeta(monto, `Pago desde cuenta ${origen.obtenerNombreComercial()} (${origen.numeroCuenta})`);
    } else {
      creditoResultado = destino.consignar(monto, `Transferencia desde cuenta ${origen.obtenerNombreComercial()} (${origen.numeroCuenta})`);
    }

    this.agregarNotificacion({
      titulo: 'Transferencia entre tus productos realizada',
      mensaje: `Moviste $${monto.toLocaleString('es-CO')} USD de ${origen.obtenerNombreComercial()} a ${destino.obtenerNombreComercial()}.`,
      monto,
      tipo: 'TRANSACCION',
      categoriaTag: 'Interna',
      estadoBadge: 'Completada',
    });

    return {
      exito: true,
      mensaje: `Transferencia interna exitosa por $${monto.toLocaleString('es-CO')} USD. Origen (${origen.obtenerNombreComercial()}): $${origen.saldo.toLocaleString('es-CO')} USD. Destino (${destino.obtenerNombreComercial()}): $${destino.saldo.toLocaleString('es-CO')} USD.`,
      saldoAnterior: debitoResultado.saldoAnterior,
      saldoNuevo: origen.saldo,
      detalles: {
        origen: origen.numeroCuenta,
        destino: destino.numeroCuenta,
        monto,
      },
    };
  }

  // Notificaciones
  agregarNotificacion(notif: Omit<NotificacionBancaria, 'id' | 'fecha' | 'leida'> & { id?: string; fecha?: Date; leida?: boolean }): void {
    const nueva: NotificacionBancaria = {
      id: notif.id || `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      titulo: notif.titulo,
      mensaje: notif.mensaje,
      monto: notif.monto,
      tipo: notif.tipo,
      categoriaTag: notif.categoriaTag || 'Transacciones',
      estadoBadge: notif.estadoBadge || 'Completada',
      leida: notif.leida || false,
      fecha: notif.fecha || new Date(),
      meta: notif.meta,
    };
    this.#notificaciones.unshift(nueva);
  }

  marcarTodasNotificacionesLeidas(): void {
    this.#notificaciones.forEach(n => { n.leida = true; });
  }

  // Cambio administrativo de contraseña o recuperación
  establecerPasswordAdmin(nuevaClave: string): void {
    if (nuevaClave.length >= 6) {
      this.#password = nuevaClave;
    }
  }

  // Helper de persistencia encapsulado para el almacenamiento local del Banco
  obtenerClaveParaAlmacenamiento(): string {
    return this.#password;
  }
}
