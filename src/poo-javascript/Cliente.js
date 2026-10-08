/**
 * @file Cliente.js
 * @description Clase Cliente según el Diagrama UML de &rys Bank
 * Pilares POO: Abstracción y Encapsulamiento (Campos privados # y validación)
 */

import { CuentaAhorros } from './CuentaAhorros.js';
import { CuentaCorriente } from './CuentaCorriente.js';
import { TarjetaCredito } from './TarjetaCredito.js';

export class Cliente {
  // Atributos privados (-) según Diagrama UML
  #identificacion;
  #nombreCompleto;
  #celular;
  #username;
  #password;
  #cuentas;

  // Variables de control de seguridad bancaria
  #intentosFallidos = 0;
  #bloqueado = false;
  static MAX_INTENTOS = 3;

  /**
   * @param {string} identificacion - Cédula o pasaporte
   * @param {string} nombreCompleto - Nombre y apellido
   * @param {string} celular - Número de teléfono móvil
   * @param {string} username - Nombre de usuario único
   * @param {string} password - Contraseña de acceso
   */
  constructor(identificacion, nombreCompleto, celular, username, password) {
    this.#identificacion = String(identificacion || '').trim();
    this.#nombreCompleto = String(nombreCompleto || '').trim();
    this.#celular = String(celular || '').trim();
    this.#username = String(username || '').toLowerCase().trim();
    this.#password = String(password || '');
    this.#cuentas = []; // Relación 1 posee * List<Cuenta> según Diagrama UML
  }

  // --- Getters Encapsulados ---
  get identificacion() { return this.#identificacion; }
  get nombreCompleto() { return this.#nombreCompleto; }
  get celular() { return this.#celular; }
  get username() { return this.#username; }
  get cuentas() { return [...this.#cuentas]; }
  get intentosFallidos() { return this.#intentosFallidos; }
  get bloqueado() { return this.#bloqueado; }

  /**
   * Método público (+) según Diagrama UML: registrar()
   * Inicializa el paquete de productos financieros obligatorios del cliente:
   * 1. Cuenta de Ahorros
   * 2. Cuenta Corriente
   * 3. Tarjeta de Crédito
   * @param {object} [opciones]
   * @returns {Cliente}
   */
  registrar(opciones = {}) {
    const sufijo = Math.floor(1000 + Math.random() * 9000);

    const ctaAhorros = new CuentaAhorros(
      `AHO-${sufijo}-01`,
      opciones.saldoAhorros !== undefined ? opciones.saldoAhorros : 2000.00
    );

    const ctaCorriente = new CuentaCorriente(
      `COR-${sufijo}-02`,
      opciones.saldoCorriente !== undefined ? opciones.saldoCorriente : 1000.00
    );

    const tarjeta = new TarjetaCredito(
      `TC-${sufijo}-03`,
      opciones.cupoTarjeta !== undefined ? opciones.cupoTarjeta : 5000.00
    );

    this.#cuentas = [ctaAhorros, ctaCorriente, tarjeta];
    return this;
  }

  /**
   * Método público (+) según Diagrama UML: iniciarSesion()
   * Valida la contraseña y gestiona la regla de seguridad de 3 intentos fallidos
   * @param {string} claveIngresada
   * @returns {{ exito: boolean, mensaje: string, bloqueado?: boolean, intentosRestantes?: number }}
   */
  iniciarSesion(claveIngresada) {
    if (this.#bloqueado) {
      return {
        exito: false,
        mensaje: "Cuenta bloqueada por seguridad tras superar los 3 intentos fallidos. Comunícate con un administrador.",
        bloqueado: true,
        intentosRestantes: 0,
      };
    }

    if (this.#password === claveIngresada) {
      this.#intentosFallidos = 0; // Restablecer contador al tener éxito
      return {
        exito: true,
        mensaje: `Inicio de sesión exitoso. ¡Bienvenido, ${this.#nombreCompleto}!`,
        intentosRestantes: Cliente.MAX_INTENTOS,
      };
    } else {
      this.#intentosFallidos++;
      const restantes = Math.max(0, Cliente.MAX_INTENTOS - this.#intentosFallidos);

      if (this.#intentosFallidos >= Cliente.MAX_INTENTOS) {
        this.#bloqueado = true;
        return {
          exito: false,
          mensaje: "¡Alerta de Seguridad! Has superado el límite de 3 intentos fallidos consecutivos. Tu cuenta ha quedado bloqueada.",
          bloqueado: true,
          intentosRestantes: 0,
        };
      }

      return {
        exito: false,
        mensaje: `Contraseña incorrecta. Intentos restantes: ${restantes} de ${Cliente.MAX_INTENTOS}.`,
        bloqueado: false,
        intentosRestantes: restantes,
      };
    }
  }

  /**
   * Desbloqueo administrativo de la cuenta
   */
  desbloquear() {
    this.#bloqueado = false;
    this.#intentosFallidos = 0;
  }

  /**
   * Método público (+) según Diagrama UML: editarPerfil()
   * Modifica y guarda datos del cliente (nombre, celular, identificación)
   * @param {{ nombreCompleto?: string, celular?: string, identificacion?: string }} nuevosDatos
   * @returns {{ exito: boolean, mensaje: string }}
   */
  editarPerfil(nuevosDatos = {}) {
    if (nuevosDatos.nombreCompleto) {
      this.#nombreCompleto = String(nuevosDatos.nombreCompleto).trim();
    }
    if (nuevosDatos.celular) {
      this.#celular = String(nuevosDatos.celular).trim();
    }
    if (nuevosDatos.identificacion) {
      this.#identificacion = String(nuevosDatos.identificacion).trim();
    }

    return {
      exito: true,
      mensaje: "Datos de perfil actualizados exitosamente.",
    };
  }

  /**
   * Método público (+) según Diagrama UML: cambiarPassword()
   * Proceso seguro: Clave actual -> Nueva clave -> Confirmación
   * @param {string} claveActual
   * @param {string} nuevaClave
   * @param {string} confirmacion
   * @returns {{ exito: boolean, mensaje: string }}
   */
  cambiarPassword(claveActual, nuevaClave, confirmacion) {
    if (this.#password !== claveActual) {
      return { exito: false, mensaje: "La contraseña actual no coincide." };
    }

    if (!nuevaClave || nuevaClave.length < 6) {
      return { exito: false, mensaje: "La nueva contraseña debe tener mínimo 6 caracteres." };
    }

    if (nuevaClave !== confirmacion) {
      return { exito: false, mensaje: "La confirmación no coincide con la nueva contraseña." };
    }

    if (nuevaClave === claveActual) {
      return { exito: false, mensaje: "La nueva contraseña no puede ser idéntica a la anterior." };
    }

    this.#password = nuevaClave;
    return {
      exito: true,
      mensaje: "Contraseña actualizada con éxito.",
    };
  }

  /**
   * Obtener una cuenta específica por su número
   * @param {string} numeroCuenta
   * @returns {Cuenta|undefined}
   */
  obtenerCuenta(numeroCuenta) {
    return this.#cuentas.find(c => c.numeroCuenta === numeroCuenta);
  }

  /**
   * Agregar cuenta al portafolio
   * @param {Cuenta} cuenta
   */
  agregarCuenta(cuenta) {
    this.#cuentas.push(cuenta);
  }
}
