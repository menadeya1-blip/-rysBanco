// 1. definir la clase
export class Movimiento {
    // 2. definir los atributos privados
    #fechaHora;
    #tipo;
    #valor;

    // 3. constructor
    constructor(tipo, valor, fechaHora = new Date()) {
        this.#tipo = tipo;
        this.#valor = Number(valor);
        this.#fechaHora = fechaHora instanceof Date ? fechaHora : new Date(fechaHora);
    }

    // 4. colocar los get y set
    get fechaHora() {
        return this.#fechaHora;
    }

    set fechaHora(nuevaFecha) {
        this.#fechaHora = nuevaFecha;
    }

    get tipo() {
        return this.#tipo;
    }

    set tipo(nuevoTipo) {
        this.#tipo = nuevoTipo;
    }

    get valor() {
        return this.#valor;
    }

    set valor(nuevoValor) {
        this.#valor = nuevoValor;
    }

    // 5. crear los metodos
    obtenerDetalle() {
        const fechaStr = this.#fechaHora.toLocaleString('es-CO', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
        return `[${fechaStr}] ${this.#tipo} -> $${this.#valor.toLocaleString('es-CO')} USD`;
    }

    mostrarDatos() {
        return `
        ****** DATOS DEL MOVIMIENTO ******
        Fecha y Hora -> ${this.#fechaHora.toLocaleString('es-CO')}
        Tipo ---------> ${this.#tipo}
        Valor --------> $${this.#valor.toLocaleString('es-CO')} USD
        `;
    }

    // Serialización para guardar en localStorage
    toJSON() {
        return {
            tipo: this.#tipo,
            valor: this.#valor,
            fechaHora: this.#fechaHora.toISOString()
        };
    }

    static fromJSON(data) {
        return new Movimiento(data.tipo, data.valor, new Date(data.fechaHora));
    }
}
