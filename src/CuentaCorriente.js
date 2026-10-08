import { Cuenta } from './Cuenta.js';

// 1. definir la clase (hereda de Cuenta)
export class CuentaCorriente extends Cuenta {
    // 2. definir los atributos privados
    #porcentajeSobregiro;

    // 3. constructor
    constructor(numeroCuenta, saldo = 0, porcentajeSobregiro = 0.20) {
        super(numeroCuenta, saldo, 'Cuenta Corriente');
        this.#porcentajeSobregiro = Number(porcentajeSobregiro); // 20% adicional
    }

    // 4. colocar los get y set
    get porcentajeSobregiro() {
        return this.#porcentajeSobregiro;
    }

    set porcentajeSobregiro(nuevoPorcentaje) {
        this.#porcentajeSobregiro = Number(nuevoPorcentaje);
    }

    // Limite maximo permitido: Saldo + 20%
    calcularLimiteRetiro() {
        if (this.saldo > 0) {
            return Math.round(this.saldo * (1 + this.#porcentajeSobregiro) * 100) / 100;
        }
        return 0;
    }

    // 5. crear los metodos segun diagrama UML
    // Metodo polimorfico: permite retiro hasta saldo + 20% de sobregiro
    retirar(monto) {
        const valor = Number(monto);
        if (isNaN(valor) || valor <= 0) {
            return { exito: false, mensaje: "El monto a retirar debe ser mayor a cero." };
        }

        const saldoAnterior = this.saldo;
        const limitePermitido = this.calcularLimiteRetiro();

        // Regla: Sobregiro hasta 20% adicional (ej: saldo 1.000.000 -> limite 1.200.000)
        if (valor > limitePermitido) {
            return {
                exito: false,
                mensaje: `El monto de $${valor.toLocaleString('es-CO')} USD supera el límite máximo permitido ($${limitePermitido.toLocaleString('es-CO')} USD), que incluye tu saldo ($${saldoAnterior.toLocaleString('es-CO')} USD) más el 20% de sobregiro.`
            };
        }

        const nuevoSaldo = Math.round((saldoAnterior - valor) * 100) / 100;
        const sobregiroUsado = valor > saldoAnterior ? Math.round((valor - saldoAnterior) * 100) / 100 : 0;

        this.saldo = nuevoSaldo;
        this.agregarMovimiento(
            sobregiroUsado > 0 ? 'RETIRO_CON_SOBREGIRO' : 'RETIRO',
            valor
        );

        return {
            exito: true,
            mensaje: sobregiroUsado > 0
                ? `Retiro exitoso de $${valor.toLocaleString('es-CO')} USD. Se utilizó $${sobregiroUsado.toLocaleString('es-CO')} USD del sobregiro autorizado (20%). Saldo actual: $${nuevoSaldo.toLocaleString('es-CO')} USD.`
                : `Retiro exitoso de $${valor.toLocaleString('es-CO')} USD. Saldo restante: $${nuevoSaldo.toLocaleString('es-CO')} USD.`
        };
    }

    mostrarDatos() {
        return `
        ****** DATOS DE LA CUENTA CORRIENTE ******
        Numero de Cuenta -----> ${this.numeroCuenta}
        Tipo -----------------> ${this.tipo}
        Saldo Actual ---------> $${this.saldo.toLocaleString('es-CO')} USD
        Sobregiro Permitido --> ${(this.#porcentajeSobregiro * 100)}% adicional
        Limite Maximo Retiro -> $${this.calcularLimiteRetiro().toLocaleString('es-CO')} USD
        `;
    }
}
