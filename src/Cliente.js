import { CuentaAhorros } from './CuentaAhorros.js';
import { CuentaCorriente } from './CuentaCorriente.js';
import { TarjetaCredito } from './TarjetaCredito.js';

// 1. definir la clase
export class Cliente {
    // 2. definir los atributos privados segun Diagrama UML
    #identificacion;
    #nombreCompleto;
    #celular;
    #username;
    #password;
    #cuentas;

    // Control de seguridad (3 intentos fallidos)
    #intentosFallidos = 0;
    #bloqueado = false;

    // 3. constructor
    constructor(identificacion, nombreCompleto, celular, username, password) {
        this.#identificacion = String(identificacion || '').trim();
        this.#nombreCompleto = String(nombreCompleto || '').trim();
        this.#celular = String(celular || '').trim();
        this.#username = String(username || '').toLowerCase().trim();
        this.#password = String(password || '');
        this.#cuentas = []; // List<Cuenta> (Relación 1 posee *)
    }

    // 4. colocar los get y set
    get identificacion() {
        return this.#identificacion;
    }

    set identificacion(nuevaId) {
        this.#identificacion = String(nuevaId).trim();
    }

    get nombreCompleto() {
        return this.#nombreCompleto;
    }

    set nombreCompleto(nuevoNombre) {
        this.#nombreCompleto = String(nuevoNombre).trim();
    }

    get celular() {
        return this.#celular;
    }

    set celular(nuevoCelular) {
        this.#celular = String(nuevoCelular).trim();
    }

    get username() {
        return this.#username;
    }

    set username(nuevoUser) {
        this.#username = String(nuevoUser).toLowerCase().trim();
    }

    get password() {
        return this.#password;
    }

    set password(nuevaPass) {
        this.#password = String(nuevaPass);
    }

    get cuentas() {
        return [...this.#cuentas];
    }

    get intentosFallidos() {
        return this.#intentosFallidos;
    }

    get bloqueado() {
        return this.#bloqueado;
    }

    // 5. crear los metodos segun diagrama UML
    registrar(opciones = {}) {
        const rnd = Math.floor(1000 + Math.random() * 9000);

        const ahorro = new CuentaAhorros(
            `AHO-${rnd}-01`,
            opciones.saldoAhorros !== undefined ? opciones.saldoAhorros : 2000.00
        );

        const corriente = new CuentaCorriente(
            `COR-${rnd}-02`,
            opciones.saldoCorriente !== undefined ? opciones.saldoCorriente : 1000.00
        );

        const tarjeta = new TarjetaCredito(
            `TC-${rnd}-03`,
            opciones.cupoTarjeta !== undefined ? opciones.cupoTarjeta : 5000.00
        );

        this.#cuentas = [ahorro, corriente, tarjeta];
        return this;
    }

    iniciarSesion(clave) {
        if (this.#bloqueado) {
            return {
                exito: false,
                mensaje: "Cuenta bloqueada por seguridad tras superar 3 intentos fallidos. Contacta a un administrador.",
                bloqueado: true,
                intentosRestantes: 0
            };
        }

        if (this.#password === clave) {
            this.#intentosFallidos = 0;
            return {
                exito: true,
                mensaje: `Inicio de sesión exitoso. ¡Bienvenido a &rys Bank, ${this.#nombreCompleto}!`,
                intentosRestantes: 3
            };
        } else {
            this.#intentosFallidos++;
            const restantes = Math.max(0, 3 - this.#intentosFallidos);

            if (this.#intentosFallidos >= 3) {
                this.#bloqueado = true;
                return {
                    exito: false,
                    mensaje: "¡Alerta de Seguridad! Has superado el límite de 3 intentos fallidos. Tu cuenta ha quedado bloqueada.",
                    bloqueado: true,
                    intentosRestantes: 0
                };
            }

            return {
                exito: false,
                mensaje: `Contraseña incorrecta. Intentos restantes: ${restantes} de 3.`,
                bloqueado: false,
                intentosRestantes: restantes
            };
        }
    }

    desbloquear() {
        this.#bloqueado = false;
        this.#intentosFallidos = 0;
    }

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
            mensaje: "Datos de perfil actualizados correctamente."
        };
    }

    cambiarPassword(claveActual, nuevaClave, confirmacion) {
        if (this.#password !== claveActual) {
            return { exito: false, mensaje: "La contraseña actual no coincide." };
        }
        if (!nuevaClave || nuevaClave.length < 6) {
            return { exito: false, mensaje: "La nueva contraseña debe tener al menos 6 caracteres." };
        }
        if (nuevaClave !== confirmacion) {
            return { exito: false, mensaje: "La confirmación no coincide con la nueva contraseña." };
        }
        if (nuevaClave === claveActual) {
            return { exito: false, mensaje: "La nueva clave debe ser diferente a la anterior." };
        }

        this.#password = nuevaClave;
        return {
            exito: true,
            mensaje: "Contraseña actualizada exitosamente."
        };
    }

    obtenerCuenta(numeroCuenta) {
        return this.#cuentas.find(c => c.numeroCuenta === numeroCuenta);
    }

    agregarCuenta(cuenta) {
        this.#cuentas.push(cuenta);
    }

    mostrarDatos() {
        return `
        ****** DATOS DEL CLIENTE &rys BANK ******
        Identificacion -> ${this.#identificacion}
        Nombre ---------> ${this.#nombreCompleto}
        Celular --------> ${this.#celular}
        Username -------> ${this.#username}
        Cuentas Activas -> ${this.#cuentas.length}
        Estado ---------> ${this.#bloqueado ? 'BLOQUEADO' : 'ACTIVO'}
        `;
    }
}
