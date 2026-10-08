import { Cuenta } from './Cuenta.js';

// 1. definir la clase (hereda de Cuenta)
export class TarjetaCredito extends Cuenta {
    // 2. definir los atributos privados
    #cupoCredito;
    #deudaActual;

    // 3. constructor
    constructor(numeroCuenta, cupoCredito = 5000) {
        super(numeroCuenta, cupoCredito, 'Tarjeta de Crédito');
        this.#cupoCredito = Number(cupoCredito);
        this.#deudaActual = 0;
    }

    // 4. colocar los get y set
    get cupoCredito() {
        return this.#cupoCredito;
    }

    set cupoCredito(nuevoCupo) {
        this.#cupoCredito = Number(nuevoCupo);
    }

    get deudaActual() {
        return this.#deudaActual;
    }

    set deudaActual(nuevaDeuda) {
        this.#deudaActual = Number(nuevaDeuda);
    }

    get cupoDisponible() {
        return Math.max(0, Math.round((this.#cupoCredito - this.#deudaActual) * 100) / 100);
    }

    // Determina la tasa mensual segun las cuotas solicitadas
    obtenerTasaMensual(cuotas) {
        const n = Math.floor(cuotas);
        if (n <= 2) {
            return 0.0; // <= 2 cuotas: 0% mensual (Sin interés)
        } else if (n <= 6) {
            return 0.019; // 3 a 6 cuotas: 1.9% mensual
        } else {
            return 0.023; // >= 7 cuotas: 2.3% mensual
        }
    }

    // 5. crear los metodos segun diagrama UML
    calcularCuotaMensual(capital, cuotas) {
        const P = Number(capital);
        const n = Math.floor(Number(cuotas));
        if (P <= 0 || n < 1) return 0;

        const tasa = this.obtenerTasaMensual(n);

        // Si la tasa es 0% (1 o 2 cuotas)
        if (tasa === 0) {
            return Math.round((P / n) * 100) / 100;
        }

        // Formula financiera oficial: Cuota = (Capital * tasa) / (1 - (1 + tasa)^(-n))
        const cuota = (P * tasa) / (1 - Math.pow(1 + tasa, -n));
        return Math.round(cuota * 100) / 100;
    }

    financiarCompra(capital, cuotas, comercio = 'Comercio') {
        const P = Number(capital);
        const n = Math.floor(Number(cuotas));

        if (isNaN(P) || P <= 0) {
            return { exito: false, mensaje: "El valor de la compra debe ser mayor a cero." };
        }

        if (n < 1) {
            return { exito: false, mensaje: "Las cuotas deben ser al menos 1." };
        }

        // Validacion de cupo de credito disponible
        if (P > this.cupoDisponible) {
            return {
                exito: false,
                mensaje: `Cupo de crédito insuficiente. Compra: $${P.toLocaleString('es-CO')} USD, Cupo libre: $${this.cupoDisponible.toLocaleString('es-CO')} USD.`
            };
        }

        const cuotaMensual = this.calcularCuotaMensual(P, n);
        const tasa = this.obtenerTasaMensual(n);
        const tasaTexto = tasa === 0 ? '0% (Sin interés)' : `${(tasa * 100).toFixed(1)}% mensual`;

        this.#deudaActual = Math.round((this.#deudaActual + P) * 100) / 100;
        this.saldo = this.cupoDisponible;
        this.agregarMovimiento(`COMPRA_${comercio}`, P);

        return {
            exito: true,
            mensaje: `Compra en ${comercio} aprobada por $${P.toLocaleString('es-CO')} USD. Cuota mensual: $${cuotaMensual.toLocaleString('es-CO')} USD (${n} cuota(s) a tasa ${tasaTexto}). Cupo restante: $${this.cupoDisponible.toLocaleString('es-CO')} USD.`,
            detalles: {
                cuotaMensual,
                cuotas: n,
                deudaActual: this.#deudaActual,
                cupoDisponible: this.cupoDisponible
            }
        };
    }

    retirar(monto) {
        // Avance con tarjeta diferido a 12 cuotas
        return this.financiarCompra(monto, 12, 'Avance en Cajero');
    }

    pagarDeuda(monto) {
        const valor = Number(monto);
        if (isNaN(valor) || valor <= 0) {
            return { exito: false, mensaje: "El monto a pagar debe ser mayor a cero." };
        }

        if (this.#deudaActual <= 0) {
            return { exito: false, mensaje: "No tienes deuda pendiente en tu Tarjeta de Crédito." };
        }

        const abono = Math.min(valor, this.#deudaActual);
        this.#deudaActual = Math.round((this.#deudaActual - abono) * 100) / 100;
        this.saldo = this.cupoDisponible;
        this.agregarMovimiento('PAGO_TARJETA', abono);

        return {
            exito: true,
            mensaje: `Pago acreditado por $${abono.toLocaleString('es-CO')} USD. Deuda restante: $${this.#deudaActual.toLocaleString('es-CO')} USD. Cupo libre: $${this.cupoDisponible.toLocaleString('es-CO')} USD.`
        };
    }

    mostrarDatos() {
        return `
        ****** DATOS DE LA TARJETA DE CREDITO ******
        Numero de Tarjeta/Cuenta -> ${this.numeroCuenta}
        Cupo Asignado -----------> $${this.#cupoCredito.toLocaleString('es-CO')} USD
        Deuda Actual ------------> $${this.#deudaActual.toLocaleString('es-CO')} USD
        Cupo Disponible ---------> $${this.cupoDisponible.toLocaleString('es-CO')} USD
        `;
    }
}
