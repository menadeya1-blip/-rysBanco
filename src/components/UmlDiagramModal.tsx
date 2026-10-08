/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal de Diagrama UML y Código JavaScript para Visual Studio Code
 * Réplica fiel al diagrama UML &rys.drawio.png
 */

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Layers, 
  GitFork, 
  Download, 
  Play, 
  ExternalLink,
  Code2
} from 'lucide-react';

interface UmlDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UmlDiagramModal: React.FC<UmlDiagramModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'diagrama' | 'codigo' | 'consola'>('diagrama');
  const [activeFile, setActiveFile] = useState<'Movimiento' | 'Cuenta' | 'CuentaAhorros' | 'CuentaCorriente' | 'TarjetaCredito' | 'Cliente' | 'main'>('Cuenta');
  const [copied, setCopied] = useState(false);
  const [consoleRunning, setConsoleRunning] = useState(false);

  if (!isOpen) return null;

  const codeSnippets: Record<string, string> = {
    Movimiento: `/**
 * @file Movimiento.js
 * Pilar POO: Abstracción y Encapsulamiento
 */
export class Movimiento {
  // Atributos privados (-) según Diagrama UML
  #fechaHora;
  #tipo;
  #valor;

  constructor(tipo, valor, fechaHora = new Date()) {
    if (valor <= 0) {
      throw new Error("El valor del movimiento debe ser mayor a cero.");
    }
    this.#fechaHora = fechaHora instanceof Date ? fechaHora : new Date(fechaHora);
    this.#tipo = tipo;
    this.#valor = Math.round(Number(valor) * 100) / 100;
  }

  get fechaHora() { return this.#fechaHora; }
  get tipo() { return this.#tipo; }
  get valor() { return this.#valor; }

  // Método público (+) según Diagrama UML
  obtenerDetalle() {
    const fechaStr = this.#fechaHora.toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    return \`[\${fechaStr}] \${this.#tipo}: $\${this.#valor.toLocaleString('es-CO')} COP\`;
  }
}`,

    Cuenta: `/**
 * @file Cuenta.js
 * Superclase Abstracta Cuenta según el Diagrama UML
 * Pilares POO: Abstracción, Encapsulamiento (#) y Herencia
 */
import { Movimiento } from './Movimiento.js';

export class Cuenta {
  // Atributos protegidos (#) según Diagrama UML
  #numeroCuenta;
  #saldo;
  #tipo;
  #movimientos;

  constructor(numeroCuenta, saldoInicial = 0, tipo = 'Cuenta') {
    if (new.target === Cuenta) {
      throw new TypeError("No se puede instanciar directamente la clase abstracta Cuenta.");
    }
    this.#numeroCuenta = numeroCuenta;
    this.#saldo = Math.round(Number(saldoInicial) * 100) / 100;
    this.#tipo = tipo;
    this.#movimientos = []; // List<Movimiento>

    if (saldoInicial > 0) {
      this.agregarMovimiento('APERTURA_CONSIGNACION', saldoInicial);
    }
  }

  get numeroCuenta() { return this.#numeroCuenta; }
  get saldo() { return this.#saldo; }
  _setSaldo(nuevoSaldo) { this.#saldo = Math.round(nuevoSaldo * 100) / 100; }
  get tipo() { return this.#tipo; }
  get movimientos() { return [...this.#movimientos]; }

  // + consultarSaldo() float
  consultarSaldo() {
    return this.#saldo;
  }

  // + consignar(float monto)
  consignar(monto) {
    const valor = Number(monto);
    if (isNaN(valor) || valor <= 0) {
      return { exito: false, mensaje: "El monto debe ser positivo mayor a cero." };
    }
    this._setSaldo(this.#saldo + valor);
    this.agregarMovimiento('CONSIGNACION', valor);
    return { exito: true, mensaje: "Consignación exitosa." };
  }

  // + retirar(float monto) [POLIMÓRFICO / ABSTRACTO]
  retirar(monto) {
    throw new Error("El método retirar(monto) debe ser implementado por la subclase.");
  }

  // + transferir(Cuenta destino, float monto)
  transferir(cuentaDestino, monto) {
    if (!cuentaDestino || !(cuentaDestino instanceof Cuenta)) {
      return { exito: false, mensaje: "Cuenta destino inválida." };
    }
    // Restricción: No transferir al mismo producto
    if (this.numeroCuenta === cuentaDestino.numeroCuenta) {
      return { exito: false, mensaje: "No se permiten transferencias al mismo producto." };
    }
    const valor = Number(monto);
    const debito = this.retirar(valor);
    if (!debito.exito) return debito;

    cuentaDestino.consignar(valor);
    this.agregarMovimiento('TRANSFERENCIA_ENVIADA', valor);
    cuentaDestino.agregarMovimiento('TRANSFERENCIA_RECIBIDA', valor);
    return { exito: true, mensaje: "Transferencia exitosa." };
  }

  // + agregarMovimiento(String tipo, float valor)
  agregarMovimiento(tipo, valor) {
    this.#movimientos.unshift(new Movimiento(tipo, valor));
  }
}`,

    CuentaAhorros: `/**
 * @file CuentaAhorros.js
 * Subclase de Cuenta según el Diagrama UML
 * Regla: 1.5% mensual aplicado al momento del retiro
 */
import { Cuenta } from './Cuenta.js';

export class CuentaAhorros extends Cuenta {
  // Atributo privado (-)
  #tasaInteresMensual;

  constructor(numeroCuenta, saldoInicial = 0, tasaInteresMensual = 0.015) {
    super(numeroCuenta, saldoInicial, 'Cuenta de Ahorros');
    this.#tasaInteresMensual = Number(tasaInteresMensual); // 1.5%
  }

  get tasaInteresMensual() { return this.#tasaInteresMensual; }

  // + aplicarInteres()
  aplicarInteres() {
    const interes = Math.round(this.saldo * this.#tasaInteresMensual * 100) / 100;
    if (interes > 0) {
      this._setSaldo(this.saldo + interes);
      this.agregarMovimiento('RENDIMIENTO_INTERES', interes);
    }
    return interes;
  }

  // + retirar(float monto) [POLIMÓRFICO]
  retirar(monto) {
    const valor = Number(monto);
    if (valor > this.saldo) {
      return { exito: false, mensaje: "Fondos insuficientes en Ahorros." };
    }
    // Aplica el rendimiento antes de debitar
    const rendimiento = this.aplicarInteres();
    this._setSaldo(this.saldo - valor);
    this.agregarMovimiento('RETIRO', valor);

    return {
      exito: true,
      mensaje: \`Retiro exitoso de $\${valor}. Rendimiento acreditado: +$\${rendimiento} COP.\`,
    };
  }
}`,

    CuentaCorriente: `/**
 * @file CuentaCorriente.js
 * Subclase de Cuenta según el Diagrama UML
 * Regla: Sobregiro del 20% adicional sobre el saldo base
 */
import { Cuenta } from './Cuenta.js';

export class CuentaCorriente extends Cuenta {
  // Atributo privado (-)
  #porcentajeSobregiro;

  constructor(numeroCuenta, saldoInicial = 0, porcentajeSobregiro = 0.20) {
    super(numeroCuenta, saldoInicial, 'Cuenta Corriente');
    this.#porcentajeSobregiro = Number(porcentajeSobregiro); // 20%
  }

  get porcentajeSobregiro() { return this.#porcentajeSobregiro; }

  // Límite: Saldo * 1.20
  calcularLimiteRetiro() {
    return this.saldo > 0 ? Math.round(this.saldo * (1 + this.#porcentajeSobregiro) * 100) / 100 : 0;
  }

  // + retirar(float monto) [POLIMÓRFICO]
  retirar(monto) {
    const valor = Number(monto);
    const limite = this.calcularLimiteRetiro();
    if (valor > limite) {
      return { exito: false, mensaje: "El monto supera el saldo más el 20% de sobregiro." };
    }
    const nuevoSaldo = Math.round((this.saldo - valor) * 100) / 100;
    this._setSaldo(nuevoSaldo);
    this.agregarMovimiento('RETIRO', valor);
    return { exito: true, mensaje: \`Retiro exitoso. Saldo actual: $\${nuevoSaldo} COP.\` };
  }
}`,

    TarjetaCredito: `/**
 * @file TarjetaCredito.js
 * Subclase de Cuenta según el Diagrama UML
 * Regla: Compras a cuotas con tasas: <=2 (0%), 3-6 (1.9%), >=7 (2.3%)
 */
import { Cuenta } from './Cuenta.js';

export class TarjetaCredito extends Cuenta {
  // Atributos privados (-)
  #cupoCredito;
  #deudaActual;

  constructor(numeroCuenta, cupoCredito = 5000) {
    super(numeroCuenta, cupoCredito, 'Tarjeta de Crédito');
    this.#cupoCredito = Number(cupoCredito);
    this.#deudaActual = 0;
  }

  get cupoCredito() { return this.#cupoCredito; }
  get deudaActual() { return this.#deudaActual; }
  get cupoDisponible() { return Math.max(0, this.#cupoCredito - this.#deudaActual); }

  obtenerTasaMensual(cuotas) {
    if (cuotas <= 2) return 0.0;
    if (cuotas <= 6) return 0.019;
    return 0.023;
  }

  // + calcularCuotaMensual(float capital, int cuotas) float
  calcularCuotaMensual(capital, cuotas) {
    const P = Number(capital);
    const n = Math.floor(Number(cuotas));
    const tasa = this.obtenerTasaMensual(n);
    if (tasa === 0) return Math.round((P / n) * 100) / 100;
    const cuota = (P * tasa) / (1 - Math.pow(1 + tasa, -n));
    return Math.round(cuota * 100) / 100;
  }

  // + financiarCompra(float capital, int cuotas)
  financiarCompra(capital, cuotas, comercio = 'Comercio') {
    const P = Number(capital);
    const n = Math.floor(Number(cuotas));
    if (P > this.cupoDisponible) {
      return { exito: false, mensaje: "Cupo insuficiente." };
    }
    const cuota = this.calcularCuotaMensual(P, n);
    this.#deudaActual += P;
    this._setSaldo(this.cupoDisponible);
    this.agregarMovimiento(\`COMPRA_\${comercio}\`, P);
    return {
      exito: true,
      mensaje: \`Compra aprobada. Pago mensual: $\${cuota} USD por \${n} cuotas.\`,
    };
  }

  retirar(monto) {
    return this.financiarCompra(monto, 12, 'Avance Cajero');
  }
}`,

    Cliente: `/**
 * @file Cliente.js
 * Clase Cliente según el Diagrama UML
 * Relación: Cliente (1) posee (*) List<Cuenta>
 */
import { CuentaAhorros } from './CuentaAhorros.js';
import { CuentaCorriente } from './CuentaCorriente.js';
import { TarjetaCredito } from './TarjetaCredito.js';

export class Cliente {
  // Atributos privados (-)
  #identificacion;
  #nombreCompleto;
  #celular;
  #username;
  #password;
  #cuentas;
  #intentos = 0;
  #bloqueado = false;

  constructor(identificacion, nombreCompleto, celular, username, password) {
    this.#identificacion = identificacion;
    this.#nombreCompleto = nombreCompleto;
    this.#celular = celular;
    this.#username = username.toLowerCase().trim();
    this.#password = password;
    this.#cuentas = []; // List<Cuenta>
  }

  get identificacion() { return this.#identificacion; }
  get nombreCompleto() { return this.#nombreCompleto; }
  get celular() { return this.#celular; }
  get username() { return this.#username; }
  get cuentas() { return [...this.#cuentas]; }
  get bloqueado() { return this.#bloqueado; }

  // + registrar()
  registrar(opciones = {}) {
    const rnd = Math.floor(1000 + Math.random() * 9000);
    this.#cuentas = [
      new CuentaAhorros(\`AHO-\${rnd}\`, opciones.saldoAhorros || 2000),
      new CuentaCorriente(\`COR-\${rnd}\`, opciones.saldoCorriente || 1000),
      new TarjetaCredito(\`TC-\${rnd}\`, opciones.cupoTarjeta || 5000),
    ];
    return this;
  }

  // + iniciarSesion()
  iniciarSesion(clave) {
    if (this.#bloqueado) return { exito: false, mensaje: "Cuenta bloqueada por 3 fallos." };
    if (this.#password === clave) {
      this.#intentos = 0;
      return { exito: true, mensaje: "Bienvenido a &rys Banco." };
    }
    this.#intentos++;
    if (this.#intentos >= 3) {
      this.#bloqueado = true;
      return { exito: false, mensaje: "Cuenta bloqueada tras 3 intentos fallidos." };
    }
    return { exito: false, mensaje: \`Clave incorrecta. Intentos restantes: \${3 - this.#intentos}\` };
  }

  // + editarPerfil()
  editarPerfil(nuevosDatos) {
    if (nuevosDatos.nombreCompleto) this.#nombreCompleto = nuevosDatos.nombreCompleto;
    if (nuevosDatos.celular) this.#celular = nuevosDatos.celular;
    if (nuevosDatos.identificacion) this.#identificacion = nuevosDatos.identificacion;
    return { exito: true, mensaje: "Perfil actualizado." };
  }

  // + cambiarPassword()
  cambiarPassword(actual, nueva, confirmacion) {
    if (this.#password !== actual) return { exito: false, mensaje: "Clave actual no coincide." };
    if (nueva !== confirmacion) return { exito: false, mensaje: "Confirmación no coincide." };
    this.#password = nueva;
    return { exito: true, mensaje: "Contraseña actualizada." };
  }
}`,

    main: `/**
 * @file main.js
 * Script ejecutable en Visual Studio Code con: node src/poo-javascript/main.js
 */
import { Cliente } from './Cliente.js';

console.log("=== EJECUCIÓN POO EN JAVASCRIPT: &rys BANK ===");

const cliente = new Cliente("1098765432", "David Morales", "3009876543", "david", "pass123");
cliente.registrar({ saldoAhorros: 1000, saldoCorriente: 1000, cupoTarjeta: 5000 });

const [ahorros, corriente, tarjeta] = cliente.cuentas;

console.log("\\n1. Polimorfismo en Ahorros (1.5% interés al retirar):");
console.log(ahorros.retirar(200).mensaje);

console.log("\\n2. Polimorfismo en Corriente (Sobregiro +20%):");
console.log(corriente.retirar(1150).mensaje);

console.log("\\n3. Tarjeta de Crédito (Cuotas a 1.9% mensual):");
console.log(tarjeta.financiarCompra(1200, 6, "Apple Store").mensaje);

console.log("\\n4. Movimientos registrados:");
ahorros.movimientos.forEach(m => console.log(" ->", m.obtenerDetalle()));
`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="bg-[#090e1c] border border-cyan-500/40 rounded-3xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#060a14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">
                  Diagrama UML & Código JavaScript (Visual Studio Code)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ES6 Modules (.js)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Estructura exacta del diagrama UML lista para estudiar y ejecutar en tu entorno local
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas Principales */}
        <div className="flex border-b border-slate-800 bg-[#070c18] px-4">
          <button
            onClick={() => setActiveTab('diagrama')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'diagrama'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            Diagrama de Clases UML
          </button>
          <button
            onClick={() => setActiveTab('codigo')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'codigo'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4 text-fuchsia-400" />
            Código JavaScript (.js)
          </button>
          <button
            onClick={() => setActiveTab('consola')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'consola'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            Terminal VS Code en Vivo (node main.js)
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#050912]">
          {/* TAB 1: DIAGRAMA UML VISUAL */}
          {activeTab === 'diagrama' && (
            <div className="space-y-6">
              <div className="bg-[#080e1c] border border-cyan-800/40 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Diagrama de Clases &rys Banco</span>
                    <span className="text-emerald-400 font-mono text-xs">(Fiel a &rys.drawio.png)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Jerarquía entre Cuenta, CuentaAhorros, CuentaCorriente, TarjetaCredito, Cliente y Movimiento.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-amber-400"># Protegido</span>
                  <span>•</span>
                  <span className="text-rose-400">- Privado</span>
                  <span>•</span>
                  <span className="text-emerald-400">+ Público</span>
                </div>
              </div>

              {/* Representación Diagrama Estructurado */}
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* 1. Cliente */}
                <div className="bg-[#0b1325] border-2 border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto">
                  <div className="bg-indigo-950/80 p-3 text-center border-b border-indigo-500/40">
                    <span className="font-bold text-white text-sm">Cliente</span>
                  </div>
                  <div className="p-3.5 space-y-1 font-mono text-xs text-indigo-200 border-b border-slate-800">
                    <div>- String identificacion</div>
                    <div>- String nombreCompleto</div>
                    <div>- String celular</div>
                    <div>- String username</div>
                    <div>- String password</div>
                    <div>- List&lt;Cuenta&gt; cuentas</div>
                  </div>
                  <div className="p-3.5 space-y-1 font-mono text-xs text-slate-300 bg-black/40">
                    <div className="text-emerald-400">+ registrar()</div>
                    <div className="text-emerald-400">+ iniciarSesion()</div>
                    <div className="text-emerald-400">+ editarPerfil()</div>
                    <div className="text-emerald-400">+ cambiarPassword()</div>
                  </div>
                </div>

                {/* Flecha Posee */}
                <div className="text-center font-mono text-xs text-indigo-400 font-bold">
                  ↓ 1 posee *
                </div>

                {/* 2. Cuenta (Superclase) */}
                <div className="bg-[#0b1325] border-2 border-cyan-500/60 rounded-2xl overflow-hidden shadow-xl max-w-lg mx-auto">
                  <div className="bg-cyan-950/80 p-3 text-center border-b border-cyan-500/40">
                    <span className="font-bold text-white text-sm">Cuenta (Abstracta)</span>
                  </div>
                  <div className="p-3.5 space-y-1 font-mono text-xs text-cyan-200 border-b border-slate-800">
                    <div className="text-amber-300"># String numeroCuenta</div>
                    <div className="text-amber-300"># float saldo</div>
                    <div className="text-amber-300"># String tipo</div>
                    <div className="text-amber-300"># List&lt;Movimiento&gt; movimientos</div>
                  </div>
                  <div className="p-3.5 space-y-1 font-mono text-xs text-slate-300 bg-black/40">
                    <div className="text-emerald-400">+ consultarSaldo() float</div>
                    <div className="text-emerald-400">+ consignar(float monto)</div>
                    <div className="text-cyan-300 italic font-bold">+ retirar(float monto) [Polimórfico]</div>
                    <div className="text-emerald-400">+ transferir(Cuenta destino, float monto)</div>
                    <div className="text-emerald-400">+ agregarMovimiento(String tipo, float valor)</div>
                  </div>
                </div>

                {/* Flechas de herencia */}
                <div className="text-center font-mono text-xs text-slate-400 font-semibold">
                  ↓ hereda (extends)
                </div>

                {/* 3. Subclases y Movimiento en Grilla */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* CuentaAhorros */}
                  <div className="bg-[#091122] border-2 border-amber-500/40 rounded-xl overflow-hidden">
                    <div className="bg-amber-950/60 p-2.5 text-center font-bold text-white text-xs border-b border-amber-500/30">
                      CuentaAhorros
                    </div>
                    <div className="p-3 font-mono text-[11px] text-amber-200 border-b border-slate-800">
                      - float tasaInteresMensual
                    </div>
                    <div className="p-3 font-mono text-[11px] text-slate-300 bg-black/40 space-y-1">
                      <div className="text-cyan-300 font-bold">+ retirar(float monto)</div>
                      <div className="text-emerald-400">+ aplicarInteres()</div>
                    </div>
                  </div>

                  {/* CuentaCorriente */}
                  <div className="bg-[#091122] border-2 border-cyan-500/40 rounded-xl overflow-hidden">
                    <div className="bg-cyan-950/60 p-2.5 text-center font-bold text-white text-xs border-b border-cyan-500/30">
                      CuentaCorriente
                    </div>
                    <div className="p-3 font-mono text-[11px] text-cyan-200 border-b border-slate-800">
                      - float porcentajeSobregiro
                    </div>
                    <div className="p-3 font-mono text-[11px] text-slate-300 bg-black/40 space-y-1">
                      <div className="text-cyan-300 font-bold">+ retirar(float monto)</div>
                      <div className="text-slate-400 text-[10px]">(+20% Sobregiro)</div>
                    </div>
                  </div>

                  {/* TarjetaCredito */}
                  <div className="bg-[#091122] border-2 border-fuchsia-500/40 rounded-xl overflow-hidden">
                    <div className="bg-fuchsia-950/60 p-2.5 text-center font-bold text-white text-xs border-b border-fuchsia-500/30">
                      TarjetaCredito
                    </div>
                    <div className="p-3 font-mono text-[11px] text-fuchsia-200 border-b border-slate-800 space-y-0.5">
                      <div>- float cupoCredito</div>
                      <div>- float deudaActual</div>
                    </div>
                    <div className="p-3 font-mono text-[11px] text-slate-300 bg-black/40 space-y-1">
                      <div className="text-emerald-400">+ financiarCompra(cap, cuotas)</div>
                      <div className="text-emerald-400">+ calcularCuotaMensual(...)</div>
                    </div>
                  </div>

                  {/* Movimiento */}
                  <div className="bg-[#091122] border-2 border-emerald-500/40 rounded-xl overflow-hidden">
                    <div className="bg-emerald-950/60 p-2.5 text-center font-bold text-white text-xs border-b border-emerald-500/30">
                      Movimiento
                    </div>
                    <div className="p-3 font-mono text-[11px] text-emerald-200 border-b border-slate-800 space-y-0.5">
                      <div>- DateTime fechaHora</div>
                      <div>- String tipo</div>
                      <div>- float valor</div>
                    </div>
                    <div className="p-3 font-mono text-[11px] text-slate-300 bg-black/40">
                      <div className="text-emerald-400">+ obtenerDetalle() String</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CÓDIGO FUENTE JAVASCRIPT */}
          {activeTab === 'codigo' && (
            <div className="space-y-4">
              {/* Barra de selector de archivos */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#080d1a] p-2 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap gap-1.5">
                  {(['Movimiento', 'Cuenta', 'CuentaAhorros', 'CuentaCorriente', 'TarjetaCredito', 'Cliente', 'main'] as const).map((file) => (
                    <button
                      key={file}
                      onClick={() => setActiveFile(file)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                        activeFile === file
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      {file}.js
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '¡Copiado!' : 'Copiar para VS Code'}
                </button>
              </div>

              {/* Visor de código */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#040711]">
                <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>src/poo-javascript/{activeFile}.js</span>
                  <span className="text-[11px] text-cyan-400">Vanilla JavaScript ES6</span>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-100 overflow-x-auto leading-relaxed max-h-[50vh]">
                  {codeSnippets[activeFile]}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: TERMINAL VS CODE EN VIVO */}
          {activeTab === 'consola' && (
            <div className="space-y-4">
              <div className="bg-[#080d1a] border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Ejecución en Consola (Node.js en Visual Studio Code)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Comando ejecutado en la terminal integrada: <code className="text-cyan-300 font-mono">node src/poo-javascript/main.js</code>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setConsoleRunning(true);
                    setTimeout(() => setConsoleRunning(false), 800);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Re-ejecutar Prueba
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#03060c] p-4 font-mono text-xs text-slate-200 overflow-x-auto space-y-1.5 leading-relaxed">
                <div className="text-slate-500">$ node src/poo-javascript/main.js</div>
                <div className="text-cyan-400 font-bold">=================================================================</div>
                <div className="text-cyan-400 font-bold">   SISTEMA DE TRANSACCIONES BANCARIAS &rys BANCO       </div>
                <div className="text-cyan-400 font-bold">   DEMOSTRACIÓN DE PROGRAMACIÓN ORIENTADA A OBJETOS (POO) EN JS  </div>
                <div className="text-cyan-400 font-bold">=================================================================</div>
                
                <div className="text-amber-300 pt-2 font-bold">--- 1. ABSTRACCIÓN: Creación y Registro del Cliente ---</div>
                <div>Cliente registrado: David Morales (@david)</div>
                <div>Cuentas asignadas: 3</div>
                <div className="text-slate-400 pl-4">-&gt; [Cuenta de Ahorros] No. AHO-1058-01 | Saldo: $1.000.000 COP</div>
                <div className="text-slate-400 pl-4">-&gt; [Cuenta Corriente] No. COR-1058-02 | Saldo: $1.000.000 COP</div>
                <div className="text-slate-400 pl-4">-&gt; [Tarjeta de Crédito] No. TC-1058-03 | Saldo: $5.000.000 COP</div>

                <div className="text-amber-300 pt-2 font-bold">--- 2. ENCAPSULAMIENTO: Protección con Campos Privados (#) ---</div>
                <div>Acceso controlado mediante getter saldo: $1.000.000 COP</div>
                <div className="text-emerald-400 font-semibold">✓ En JavaScript los campos con # son totalmente inaccesibles desde el exterior.</div>

                <div className="text-amber-300 pt-2 font-bold">--- 3. HERENCIA: Relación 'es un' (extends Cuenta) ---</div>
                <div>¿ctaAhorros hereda de Cuenta?: <span className="text-emerald-400 font-bold">true</span></div>
                <div>¿ctaCorriente hereda de Cuenta?: <span className="text-emerald-400 font-bold">true</span></div>
                <div>¿ctaTarjeta hereda de Cuenta?: <span className="text-emerald-400 font-bold">true</span></div>

                <div className="text-amber-300 pt-2 font-bold">--- 4. POLIMORFISMO: Invocación de retirar() en cada Subclase ---</div>
                <div className="text-cyan-300 font-semibold">[A] CUENTA DE AHORROS (Regla: Rendimiento 1.5% mensual al retirar):</div>
                <div className="pl-4">Retiro exitoso de $200 COP. Rendimiento acreditado del 1.5%: <strong className="text-emerald-400">+$15.000 COP</strong>. Nuevo saldo: $815 COP.</div>

                <div className="text-cyan-300 font-semibold pt-1">[B] CUENTA CORRIENTE (Regla: Sobregiro del 20% adicional):</div>
                <div className="pl-4">Retiro exitoso de $1,150 COP. Se utilizó <strong className="text-amber-400">$150.000 COP de tu sobregiro del 20%</strong>. Saldo actual: $-150 COP.</div>

                <div className="text-cyan-300 font-semibold pt-1">[C] TARJETA DE CRÉDITO (Regla: Cuotas a tasa 1.9% mensual):</div>
                <div className="pl-4">Compra aprobada por $1.200.000 COP a 6 cuotas. <strong className="text-fuchsia-400">Pago mensual: $213.51 COP/mes</strong>. Cupo libre: $3,800 COP.</div>

                <div className="text-amber-300 pt-2 font-bold">--- 5. TRANSFERENCIAS & RESTRICCIONES ---</div>
                <div className="text-rose-400">✓ Bloqueo aplicado: No se permiten transferencias al mismo producto.</div>
                <div className="text-emerald-400">✓ Transferencia entre Ahorros y Corriente exitosa.</div>

                <div className="text-amber-300 pt-2 font-bold">--- 6. SEGURIDAD: 3 Intentos Fallidos y Bloqueo de Cuenta ---</div>
                <div className="text-rose-400">Intento 3 fallido: ¡Alerta de Seguridad! Tu cuenta ha quedado bloqueada.</div>
                <div className="text-emerald-400">Desbloqueo administrativo aplicado y acceso restaurado.</div>

                <div className="text-emerald-400 pt-2 font-bold">=================================================================</div>
                <div className="text-emerald-400 font-bold">   TODAS LAS PRUEBAS DE POO EJECUTADAS EXITOSAMENTE EN JAVASCRIPT </div>
                <div className="text-emerald-400 font-bold">=================================================================</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#060a14] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Archivos ubicados en <code className="text-cyan-300 font-mono">/src/poo-javascript/</code> para abrir en Visual Studio Code.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
          >
            Cerrar Visualizador
          </button>
        </div>
      </div>
    </div>
  );
};
