/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Inspector de Programación Orientada a Objetos (POO)
 * Herramienta de auditoría y demostración pedagógica de los 4 pilares en vivo
 */

import React, { useState } from 'react';
import { X, Layers, Lock, GitFork, Cpu, CheckCircle2, Play, ArrowRight, Shield } from 'lucide-react';
import { CuentaAhorros } from '../models/CuentaAhorros';
import { CuentaCorriente } from '../models/CuentaCorriente';
import { TarjetaCredito } from '../models/TarjetaCredito';

interface PooInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PooInspectorModal: React.FC<PooInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activePillar, setActivePillar] = useState<'abstraccion' | 'encapsulamiento' | 'herencia' | 'polimorfismo'>('polimorfismo');
  const [montoPrueba, setMontoPrueba] = useState<number>(1000);
  const [resultadoPrueba, setResultadoPrueba] = useState<any>(null);

  if (!isOpen) return null;

  // Demostración en vivo de polimorfismo
  const ejecutarPruebaPolimorfica = () => {
    // Instanciamos tres productos con saldo base de $1.000.000 COP
    const demoAhorros = new CuentaAhorros('AHO-DEMO-01', 1000000, 'CLI-TEST', 'Evaluador Académico');
    const demoCorriente = new CuentaCorriente('COR-DEMO-02', 1000000, 'CLI-TEST', 'Evaluador Académico');
    const demoTarjeta = new TarjetaCredito('TC-DEMO-03', 2000000, 'CLI-TEST', 'Evaluador Académico');

    // Mismo método retirar(), tres comportamientos radicalmente distintos (Polimorfismo puro)
    const resAhorros = demoAhorros.retirar(montoPrueba, 'Retiro de prueba en Ahorros');
    const resCorriente = demoCorriente.retirar(montoPrueba, 'Retiro de prueba en Corriente');
    const resTarjeta = demoTarjeta.retirar(montoPrueba, 'Avance de prueba en Tarjeta');

    setResultadoPrueba({
      ahorros: {
        clase: 'CuentaAhorros',
        limiteRetiro: demoAhorros.calcularLimiteRetiro(),
        res: resAhorros,
        explicacion: resAhorros.exito
          ? `Calculó y aplicó 1.5% de rendimiento generado (+${resAhorros.detalles?.rendimientoLiquidado?.toLocaleString('es-CO')} COP) antes del retiro.`
          : 'Rechazado porque no puede exceder el saldo disponible.',
      },
      corriente: {
        clase: 'CuentaCorriente',
        limiteRetiro: demoCorriente.calcularLimiteRetiro(),
        res: resCorriente,
        explicacion: resCorriente.exito
          ? `Permitió sobregiro del 20% (Límite: $1.200.000 COP). Sobregiro usado: $${resCorriente.detalles?.sobregiroUsado?.toLocaleString('es-CO')} COP.`
          : `Excedió el saldo base ($1.000.000 COP) más el 20% de sobregiro ($200.000 COP). Límite máximo: $1.200.000 COP.`,
      },
      tarjeta: {
        clase: 'TarjetaCredito',
        limiteRetiro: demoTarjeta.calcularLimiteRetiro(),
        res: resTarjeta,
        explicacion: resTarjeta.exito
          ? `Procesó avance contra cupo disponible ($2.000.000 COP), calculando cuota mensual diferida a 12 meses a tasa 2.3% ($${resTarjeta.detalles?.cuotaMensual} COP/mes).`
          : 'Rechazado por exceder el cupo de crédito asignado.',
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#090f1d] border border-cyan-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#060a14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-display">
                  Auditoría de Arquitectura POO
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  JavaScript / TypeScript
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Evidencia explícita de los 4 pilares fundamentales en el sistema bancario &rys Banco
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation tabs for Pillars */}
        <div className="flex border-b border-slate-800 bg-[#070c18] overflow-x-auto">
          <button
            onClick={() => setActivePillar('polimorfismo')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activePillar === 'polimorfismo'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-4 h-4 text-cyan-400" />
            1. Polimorfismo (Live Demo)
          </button>
          <button
            onClick={() => setActivePillar('herencia')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activePillar === 'herencia'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-pink-400" />
            2. Herencia
          </button>
          <button
            onClick={() => setActivePillar('encapsulamiento')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activePillar === 'encapsulamiento'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-400" />
            3. Encapsulamiento
          </button>
          <button
            onClick={() => setActivePillar('abstraccion')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activePillar === 'abstraccion'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            4. Abstracción
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* POLIMORFISMO */}
          {activePillar === 'polimorfismo' && (
            <div className="space-y-6">
              <div className="bg-cyan-950/20 border border-cyan-800/40 p-4 rounded-2xl">
                <h4 className="text-sm font-bold text-cyan-300 mb-1">
                  Demostración en Tiempo Real del Método Polimórfico: <code className="font-mono text-white">retirar(monto)</code>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Las tres clases hijas heredan de <code className="font-mono text-cyan-300">Cuenta</code> pero sobreescriben <code className="font-mono text-cyan-300">retirar()</code> y <code className="font-mono text-cyan-300">calcularLimiteRetiro()</code> de forma distinta según las reglas de negocio bancarias:
                </p>
                <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc list-inside">
                  <li><strong>CuentaAhorros:</strong> Aplica 1.5% mensual de rendimiento al momento del retiro. No permite exceder saldo disponible.</li>
                  <li><strong>CuentaCorriente:</strong> Permite sobregiro del 20% adicional sobre el saldo base. No genera intereses.</li>
                  <li><strong>TarjetaCredito:</strong> Aplica sobre cupo asignado, calcula cuota mensual con fórmula financiera francesa.</li>
                </ul>
              </div>

              {/* Controles del test */}
              <div className="flex flex-wrap items-center gap-4 bg-[#060a14] p-4 rounded-2xl border border-slate-800">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-400 block mb-1">
                    Monto a retirar simultáneamente (Saldo base de las cuentas: $1.000.000 COP):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={montoPrueba}
                      onChange={(e) => setMontoPrueba(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => setMontoPrueba(800000)}
                      className="px-2.5 py-1.5 bg-slate-800 rounded-lg text-xs text-slate-300 hover:bg-slate-700"
                    >
                      $800k
                    </button>
                    <button
                      onClick={() => setMontoPrueba(1150000)}
                      className="px-2.5 py-1.5 bg-slate-800 rounded-lg text-xs text-slate-300 hover:bg-slate-700"
                    >
                      $1.15M (Sobregiro)
                    </button>
                    <button
                      onClick={() => setMontoPrueba(1400000)}
                      className="px-2.5 py-1.5 bg-slate-800 rounded-lg text-xs text-slate-300 hover:bg-slate-700"
                    >
                      $1.4M (Excede)
                    </button>
                  </div>
                </div>

                <button
                  onClick={ejecutarPruebaPolimorfica}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 hover:brightness-110 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Ejecutar Prueba Polimórfica
                </button>
              </div>

              {/* Resultado visual */}
              {resultadoPrueba && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Ahorros */}
                  <div className="bg-[#060c18] border border-cyan-800/50 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-cyan-400">CuentaAhorros</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${resultadoPrueba.ahorros.res.exito ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                        {resultadoPrueba.ahorros.res.exito ? 'Aprobado' : 'Rechazado'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      Límite Retiro: <strong className="text-white">${resultadoPrueba.ahorros.limiteRetiro.toLocaleString('es-CO')} COP</strong>
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 min-h-[70px]">
                      {resultadoPrueba.ahorros.explicacion}
                    </div>
                  </div>

                  {/* Corriente */}
                  <div className="bg-[#060c18] border border-amber-800/50 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-amber-400">CuentaCorriente</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${resultadoPrueba.corriente.res.exito ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                        {resultadoPrueba.corriente.res.exito ? 'Aprobado (+20%)' : 'Rechazado'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      Límite Retiro: <strong className="text-white">${resultadoPrueba.corriente.limiteRetiro.toLocaleString('es-CO')} COP</strong>
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 min-h-[70px]">
                      {resultadoPrueba.corriente.explicacion}
                    </div>
                  </div>

                  {/* Tarjeta */}
                  <div className="bg-[#060c18] border border-fuchsia-800/50 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-fuchsia-400">TarjetaCredito</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${resultadoPrueba.tarjeta.res.exito ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                        {resultadoPrueba.tarjeta.res.exito ? 'Aprobado Cupo' : 'Rechazado'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      Límite Retiro: <strong className="text-white">${resultadoPrueba.tarjeta.limiteRetiro.toLocaleString('es-CO')} COP</strong>
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 min-h-[70px]">
                      {resultadoPrueba.tarjeta.explicacion}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HERENCIA */}
          {activePillar === 'herencia' && (
            <div className="space-y-4">
              <div className="bg-[#060a14] border border-slate-800 p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-pink-400 mb-2">
                  Jerarquía de Clases y Reutilización de Código
                </h4>
                <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 overflow-x-auto">
                  <div className="text-amber-400 font-bold">abstract class Cuenta {'{'}</div>
                  <div className="pl-4 text-slate-400">#numeroCuenta, #saldo, #movimientos, #activa;</div>
                  <div className="pl-4 text-cyan-400">consignar(monto: number): OperacionResultado;</div>
                  <div className="pl-4 text-pink-400">abstract retirar(monto: number): OperacionResultado;</div>
                  <div className="pl-4 text-pink-400">abstract calcularLimiteRetiro(): number;</div>
                  <div className="text-amber-400 font-bold">{'}'}</div>

                  <div className="pl-4 py-1 text-slate-500 font-sans italic">↓ Jerarquía de Subclases con herencia `extends Cuenta`</div>

                  <div className="pl-6 text-emerald-400 font-semibold">
                    class CuentaAhorros extends Cuenta {'{'} #tasaInteresMensual = 0.015 {'}'}
                  </div>
                  <div className="pl-6 text-cyan-400 font-semibold">
                    class CuentaCorriente extends Cuenta {'{'} #porcentajeSobregiro = 0.20 {'}'}
                  </div>
                  <div className="pl-6 text-fuchsia-400 font-semibold">
                    class TarjetaCredito extends Cuenta {'{'} #cupoTotal, #deudaActual, #tasas {'}'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ENCAPSULAMIENTO */}
          {activePillar === 'encapsulamiento' && (
            <div className="space-y-4">
              <div className="bg-[#060a14] border border-slate-800 p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-amber-400 mb-2">
                  Protección de Atributos mediante Campos Privados (#) y Modificadores
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Los atributos críticos como saldos, contraseñas, cupos e historial de transacciones están completamente blindados con campos privados de JavaScript estándar (<code className="font-mono text-amber-300">#saldo</code>, <code className="font-mono text-amber-300">#password</code>). Ninguna capa externa puede mutar directamente el saldo sin pasar por las validaciones de negocio de los métodos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold">✓ Acceso Controlado (Getters)</span>
                    <pre className="mt-2 text-slate-400 font-mono text-[11px]">
{`get saldo(): number {
  return this.#saldo;
}`}
                    </pre>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-rose-400 font-bold">✗ Intento de Mutación Ilegal</span>
                    <pre className="mt-2 text-slate-400 font-mono text-[11px]">
{`// Error de compilación y runtime
cuenta.#saldo = 999999;
// "Property '#saldo' is not accessible"`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABSTRACCIÓN */}
          {activePillar === 'abstraccion' && (
            <div className="space-y-4">
              <div className="bg-[#060a14] border border-slate-800 p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-emerald-400 mb-2">
                  Modelado Conceptual y Separación de Responsabilidades
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Se abstraen entidades del mundo real bancario en modelos con contratos limpios:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <strong className="text-white">Cliente:</strong> Identidad, credenciales, bloqueo de 3 intentos, notificaciones y tenencia de productos.
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <strong className="text-white">Cuenta:</strong> Reglas financieras, balance contable, cálculo de límites y registro de movimientos en List/Array.
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <strong className="text-white">Banco:</strong> Orquestador global, mediador de transferencias inter-clientes y operaciones CRUD administrativas.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#060a14] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Cerrar Auditoría
          </button>
        </div>
      </div>
    </div>
  );
};
