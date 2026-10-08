import { Movimiento } from './Movimiento.js';

// 1. definir la clase
export class Cuenta {
    // 2. definir los atributos protegidos/privados
    #numeroCuenta;
    #saldo;
    #tipo;
    #movimientos;

    // 3. constructor
    constructor(numeroCuenta, saldo = 0, tipo = 'Cuenta') {
        this.#numeroCuenta = numeroCuenta;
        this.#saldo = Number(saldo);
        this.#tipo = tipo;
        this.#movimientos = []; // List<Movimiento>

        if (saldo > 0) {
            this.agregarMovimiento('APERTURA', saldo);
        }
    }

    // 4. colocar los get y set
    get numeroCuenta() {
        return this.#numeroCuenta;
    }

    set numeroCuenta(nuevoNumero) {
        this.#numeroCuenta = nuevoNumero;
    }

    get saldo() {
        return this.#saldo;
    }

    set saldo(nuevoSaldo) {
        this.#saldo = Number(nuevoSaldo);
    }

    get tipo() {
        return this.#tipo;
    }

    set tipo(nuevoTipo) {
        this.#tipo = nuevoTipo;
    }

    get movimientos() {
        return [...this.#movimientos];
    }

    // 5. crear los metodos segun diagrama UML
    consultarSaldo() {
        return this.#saldo;
    }

    consignar(monto) {
        const valor = Number(monto);
        if (isNaN(valor) || valor <= 0) {
            return { exito: false, mensaje: "El monto a consignar debe ser mayor a cero." };
        }
        this.#saldo = Math.round((this.#saldo + valor) * 100) / 100;
        this.agregarMovimiento('CONSIGNACION', valor);
        return {
            exito: true,
            mensaje: `Consignación exitosa por $${valor.toLocaleString('es-CO')} USD. Nuevo saldo: $${this.#saldo.toLocaleString('es-CO')} USD.`
        };
    }

    // Metodo polimorfico para sobreescribir en las subclases
    retirar(monto) {
        const valor = Number(monto);
        if (isNaN(valor) || valor <= 0) {
            return { exito: false, mensaje: "El monto a retirar debe ser mayor a cero." };
        }
        if (valor > this.#saldo) {
            return { exito: false, mensaje: "Saldo insuficiente." };
        }
        this.#saldo = Math.round((this.#saldo - valor) * 100) / 100;
        this.agregarMovimiento('RETIRO', valor);
        return {
            exito: true,
            mensaje: `Retiro exitoso de $${valor.toLocaleString('es-CO')} USD. Saldo restante: $${this.#saldo.toLocaleString('es-CO')} USD.`
        };
    }

    transferir(cuentaDestino, monto) {
        if (!cuentaDestino) {
            return { exito: false, mensaje: "Cuenta destino no válida." };
        }

        // Restricción: No se permite transferir al mismo producto
        if (this.#numeroCuenta === cuentaDestino.numeroCuenta) {
            return { exito: false, mensaje: "Restricción: No se permiten transferencias al mismo producto." };
        }

        const valor = Number(monto);
        if (isNaN(valor) || valor <= 0) {
            return { exito: false, mensaje: "El monto a transferir debe ser mayor a cero." };
        }

        // Ejecutar debito polimorfico
        const resDebito = this.retirar(valor);
        if (!resDebito.exito) {
            return resDebito;
        }

        // Acreditar en destino
        cuentaDestino.consignar(valor);
        this.agregarMovimiento('TRANSFERENCIA_ENVIADA', valor);
        cuentaDestino.agregarMovimiento('TRANSFERENCIA_RECIBIDA', valor);

        return {
            exito: true,
            mensaje: `Transferencia exitosa de $${valor.toLocaleString('es-CO')} USD a la cuenta ${cuentaDestino.numeroCuenta}.`
        };
    }

    agregarMovimiento(tipo, valor) {
        const nuevoMov = new Movimiento(tipo, valor);
        this.#movimientos.unshift(nuevoMov);
    }

    mostrarDatos() {
        return `
        ****** DATOS DE LA CUENTA ******
        Numero de Cuenta -> ${this.#numeroCuenta}
        Tipo -------------> ${this.#tipo}
        Saldo ------------> $${this.#saldo.toLocaleString('es-CO')} USD
        Movimientos ------> ${this.#movimientos.length} registrados
        `;
    }
}
