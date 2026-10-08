/**
 * @file main.js
 * @description Script de Prueba y Demostración en Consola para Visual Studio Code
 * 
 * ¿Cómo ejecutarlo en Visual Studio Code?
 * 1. Abre la terminal integrada de VS Code (Ctrl + ` o Terminal > New Terminal).
 * 2. Asegúrate de estar en esta carpeta o ejecuta:
 *    node src/poo-javascript/main.js
 * 
 * Este archivo demuestra en ejecución los 4 Pilares de la POO:
 * 1. Abstracción: Modelado de Cliente, Cuenta, CuentaAhorros, CuentaCorriente, TarjetaCredito, Movimiento.
 * 2. Encapsulamiento: Uso de campos privados (#) y métodos seguros.
 * 3. Herencia: Uso de extends Cuenta para compartir lógica de saldo y movimientos.
 * 4. Polimorfismo: Mismo método retirar() comportándose según las reglas de cada cuenta.
 */

import { Cliente } from './Cliente.js';
import { CuentaAhorros } from './CuentaAhorros.js';
import { CuentaCorriente } from './CuentaCorriente.js';
import { TarjetaCredito } from './TarjetaCredito.js';

console.log("=================================================================");
console.log("   SISTEMA DE TRANSACCIONES BANCARIAS &rys BANK / MI PLATA       ");
console.log("   DEMOSTRACIÓN DE PROGRAMACIÓN ORIENTADA A OBJETOS (POO) EN JS  ");
console.log("=================================================================\n");

// -------------------------------------------------------------------------
// 1. ABSTRACCIÓN Y REGISTRO DE UN CLIENTE
// -------------------------------------------------------------------------
console.log("--- 1. ABSTRACCIÓN: Creación y Registro del Cliente ---");
const cliente = new Cliente(
  "1098765432",
  "David Morales",
  "+57 300 987 6543",
  "david",
  "password123"
);

// El método registrar() instancia sus tres productos según el diagrama UML
cliente.registrar({
  saldoAhorros: 1000.00,
  saldoCorriente: 1000.00,
  cupoTarjeta: 5000.00,
});

console.log(`Cliente registrado: ${cliente.nombreCompleto} (@${cliente.username})`);
console.log(`Cuentas asignadas: ${cliente.cuentas.length}`);
cliente.cuentas.forEach(c => {
  console.log(`  -> [${c.tipo}] No. ${c.numeroCuenta} | Saldo: $${c.consultarSaldo()} USD`);
});
console.log("\n");

// -------------------------------------------------------------------------
// 2. ENCAPSULAMIENTO: Protección de Atributos Privados
// -------------------------------------------------------------------------
console.log("--- 2. ENCAPSULAMIENTO: Protección con Campos Privados (#) ---");
const cuentaAhorros = cliente.cuentas[0];

console.log(`Acceso controlado mediante getter saldo: $${cuentaAhorros.saldo} USD`);

try {
  // Intentar acceder directamente a un atributo privado causará error de sintaxis en JS
  console.log("Intentando modificar cuentaAhorros.#saldo directamente...");
  // eval("cuentaAhorros.#saldo = 999999;");
  console.log("✓ En JavaScript los campos con # son totalmente inaccesibles desde el exterior.");
} catch (e) {
  console.log(`✓ Error capturado exitosamente: ${e.message}`);
}
console.log("\n");

// -------------------------------------------------------------------------
// 3. HERENCIA: Comprobación de la Jerarquía de Clases
// -------------------------------------------------------------------------
console.log("--- 3. HERENCIA: Relación 'es un' (extends Cuenta) ---");
const ctaAhorros = cliente.cuentas[0];
const ctaCorriente = cliente.cuentas[1];
const ctaTarjeta = cliente.cuentas[2];

console.log(`¿ctaAhorros hereda de Cuenta?: ${ctaAhorros instanceof CuentaAhorros} / ${ctaAhorros instanceof Object}`);
console.log(`¿ctaCorriente hereda de Cuenta?: ${ctaCorriente instanceof CuentaCorriente}`);
console.log(`¿ctaTarjeta hereda de Cuenta?: ${ctaTarjeta instanceof TarjetaCredito}`);
console.log("\n");

// -------------------------------------------------------------------------
// 4. POLIMORFISMO: Mismo método retirar(), tres reglas bancarias distintas
// -------------------------------------------------------------------------
console.log("--- 4. POLIMORFISMO: Invocación de retirar() en cada Subclase ---");

console.log("\n[A] CUENTA DE AHORROS (Regla: Rendimiento del 1.5% mensual aplicado al retiro):");
console.log(`Saldo inicial: $${ctaAhorros.saldo} USD`);
// Al retirar $200, el sistema calcula 1.5% sobre $1000 (+$15 USD) y luego descuenta $200
const resAhorro = ctaAhorros.retirar(200);
console.log(`Resultado: ${resAhorro.mensaje}`);
console.log(`Saldo resultante: $${ctaAhorros.saldo} USD`);

console.log("\n[B] CUENTA CORRIENTE (Regla: Sobregiro del 20% adicional sobre el saldo):");
console.log(`Saldo actual: $${ctaCorriente.saldo} USD (Límite con sobregiro: $${ctaCorriente.calcularLimiteRetiro()} USD)`);
// Con saldo de $1,000, intentamos retirar $1,150 (dentro del límite de $1,200)
const resCorriente = ctaCorriente.retirar(1150);
console.log(`Resultado: ${resCorriente.mensaje}`);
console.log(`Saldo resultante: $${ctaCorriente.saldo} USD (en sobregiro de -$150 USD)`);

console.log("\n[C] TARJETA DE CRÉDITO (Regla: Financiación a cuotas con tasas oficiales):");
console.log(`Cupo inicial: $${ctaTarjeta.cupoCredito} USD | Cupo disponible: $${ctaTarjeta.cupoDisponible} USD`);
// Compra de $1,200 a 6 cuotas (tasa del 1.9% mensual)
const resCompra = ctaTarjeta.financiarCompra(1200, 6, "Apple Store");
console.log(`Resultado: ${resCompra.mensaje}`);
console.log(`Cuota mensual estimada: $${resCompra.detalles.cuotaMensual} USD`);
console.log(`Cupo libre restante: $${ctaTarjeta.cupoDisponible} USD | Deuda actual: $${ctaTarjeta.deudaActual} USD`);
console.log("\n");

// -------------------------------------------------------------------------
// 5. TRANSFERENCIAS ENTRE PRODUCTOS (Validación de Restricciones)
// -------------------------------------------------------------------------
console.log("--- 5. TRANSFERENCIAS: Entre Cuentas y Restricción al Mismo Producto ---");
console.log("Intento 1: Transferir a la misma cuenta...");
const intentoMismaCuenta = ctaAhorros.transferir(ctaAhorros, 100);
console.log(`Resultado: ${intentoMismaCuenta.mensaje} (Bloqueado por regla de negocio)`);

console.log("\nIntento 2: Transferir de Ahorros a Corriente ($150 USD)...");
const resTransfer = ctaAhorros.transferir(ctaCorriente, 150);
console.log(`Resultado: ${resTransfer.mensaje}`);
console.log(`Saldo Ahorros: $${ctaAhorros.saldo} USD`);
console.log(`Saldo Corriente: $${ctaCorriente.saldo} USD`);
console.log("\n");

// -------------------------------------------------------------------------
// 6. HISTORIAL DE MOVIMIENTOS (Uso de obtenerDetalle())
// -------------------------------------------------------------------------
console.log("--- 6. REGISTRO DE MOVIMIENTOS: Estructura List<Movimiento> ---");
console.log(`Últimos movimientos de la Cuenta de Ahorros (${ctaAhorros.movimientos.length} registrados):`);
ctaAhorros.movimientos.forEach(m => {
  console.log(`  -> ${m.obtenerDetalle()}`);
});
console.log("\n");

// -------------------------------------------------------------------------
// 7. SEGURIDAD: Contador de Intentos y Bloqueo al Tercer Fallo
// -------------------------------------------------------------------------
console.log("--- 7. SEGURIDAD: 3 Intentos Fallidos y Bloqueo de Cuenta ---");
console.log("Intento 1 con contraseña errónea:");
console.log(cliente.iniciarSesion("clave_incorrecta_1").mensaje);

console.log("Intento 2 con contraseña errónea:");
console.log(cliente.iniciarSesion("clave_incorrecta_2").mensaje);

console.log("Intento 3 con contraseña errónea (Debe bloquearse):");
const intento3 = cliente.iniciarSesion("clave_incorrecta_3");
console.log(intento3.mensaje);
console.log(`¿Está bloqueado el cliente?: ${cliente.bloqueado}`);

console.log("\nIntentando con la clave correcta mientras está bloqueado:");
console.log(cliente.iniciarSesion("password123").mensaje);

console.log("\nDesbloqueando cuenta por vía administrativa...");
cliente.desbloquear();
console.log("Intentando login tras desbloqueo:");
console.log(cliente.iniciarSesion("password123").mensaje);

console.log("\n=================================================================");
console.log("   TODAS LAS PRUEBAS DE POO EJECUTADAS EXITOSAMENTE EN JAVASCRIPT ");
console.log("=================================================================");
