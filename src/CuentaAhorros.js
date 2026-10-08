import { Cuenta } from './Cuenta.js';

// 1. definir la clase (hereda de Cuenta)
export class CuentaAhorros extends Cuenta {
    // 2. definir los atributos privados
    #tasaInteresMensual;

    // 3. constructor
    constructor(numeroCuenta, saldo = 0, tasaInteresMensual = 0.015) {
        super(numeroCuenta, saldo, 'Cuenta de Ahorros');
        this.#tasaInteresMensual = Number(tasaInteresMensual);
    }

    // 4. colocar los get y set
    get tasaInteresMensual() {
        return this.#tasaInteresMensual;
    }

    set tasaInteresMensual(nuevaTasa) {
        this.#tasaInteresMensual = Number(nuevaTasa);
    }

    // 5. crear los metodos segun diagrama UML
    aplicarInteres() {
        const interes = Math.round(this.saldo * this.#tasaInteresMensual * 100) / 100;
        if (interes > 0) {
            this.saldo = this.saldo + interes;
            this.agregarMovimiento('RENDIMIENTO_INTERES', interes);
        }
        return interes;
    }

    // Metodo polimorfico: aplicar interes de 1.5% en el retiro y restringir al saldo
    retirar(monto) {
        const valor = Number(monto);
        if (isNaN(valor) || valor <= 0) {
            return { exito: false, mensaje: "El monto a retirar debe ser mayor a cero." };
        }

        // Restriccion: El monto a retirar no puede superar el saldo disponible
        if (valor > this.saldo) {
            return {
                exito: false,
                mensaje: `Fondos insuficientes en Cuenta de Ahorros. Saldo disponible: $${this.saldo.toLocaleString('es-CO')} USD, Monto solicitado: $${valor.toLocaleString('es-CO')} USD.`
            };
        }

        // Regla: Se calcula y aplica el rendimiento del 1.5% mensual al momento del retiro
        const interesGanado = this.aplicarInteres();

        // Se descuenta el valor del retiro
        this.saldo = Math.round((this.saldo - valor) * 100) / 100;
        this.agregarMovimiento('RETIRO', valor);

        return {
            exito: true,
            mensaje: `Retiro exitoso de $${valor.toLocaleString('es-CO')} USD. Rendimiento liquidado del 1.5%: +$${interesGanado.toLocaleString('es-CO')} USD. Saldo final: $${this.saldo.toLocaleString('es-CO')} USD.`
        };
    }

    mostrarDatos() {
        return `
        ****** DATOS DE LA CUENTA DE AHORROS ******
        Numero de Cuenta -----> ${this.numeroCuenta}
        Tipo -----------------> ${this.tipo}
        Saldo Actual ---------> $${this.saldo.toLocaleString('es-CO')} USD
        Tasa Interes Mensual -> ${(this.#tasaInteresMensual * 100).toFixed(2)}% mensual
        Movimientos ----------> ${this.movimientos.length}
        `;
    }
}
