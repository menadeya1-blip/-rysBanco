/**
 * @file Main.js
 * Archivo principal ejecutable en Visual Studio Code:
 * node src/Main.js
 */

import { Cliente } from './Cliente.js';

console.log("=========================================================");
console.log("             &rys Bank - SISTEMA BANCARIO POO             ");
console.log("=========================================================\n");

// 1. Instanciacion del cliente segun UML
const cliente1 = new Cliente(
    "1098765432",
    "David Morales",
    "+57 300 987 6543",
    "david",
    "password123"
);

// 2. Registrar productos del cliente
cliente1.registrar({
    saldoAhorros: 1000.00,
    saldoCorriente: 1000.00,
    cupoTarjeta: 5000.00
});

console.log(cliente1.mostrarDatos());

// 3. Comprobacion de metodos en las cuentas
const [ahorros, corriente, tarjeta] = cliente1.cuentas;

console.log("\n--- [1] Prueba Cuenta de Ahorros (1.5% al retirar) ---");
console.log(ahorros.mostrarDatos());
const resAhorro = ahorros.retirar(200);
console.log(resAhorro.mensaje);

console.log("\n--- [2] Prueba Cuenta Corriente (Sobregiro 20%) ---");
console.log(corriente.mostrarDatos());
const resCorriente = corriente.retirar(1150);
console.log(resCorriente.mensaje);

console.log("\n--- [3] Prueba Tarjeta de Credito (Compras a Cuotas) ---");
console.log(tarjeta.mostrarDatos());
const resCompra = tarjeta.financiarCompra(1200, 6, "Apple Store");
console.log(resCompra.mensaje);

console.log("\n--- [4] Transferencia entre cuentas ---");
const resTransfer = ahorros.transferir(corriente, 100);
console.log(resTransfer.mensaje);

console.log("\n--- [5] Movimientos Registrados ---");
ahorros.movimientos.forEach(m => {
    console.log(m.obtenerDetalle());
});

console.log("\n=========================================================");
console.log("        EJECUCION COMPLETADA EXITOSAMENTE EN NODE.JS     ");
console.log("=========================================================");
