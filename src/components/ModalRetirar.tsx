/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal Retirar Dinero (Módulo 4.3)
 * Aplica reglas polimórficas de 1.5% mensual en Ahorros y 20% de sobregiro en Corriente
 */

import React, { useState } from 'react';
import { X, ArrowUpRight, AlertCircle, Info, Sparkles, AlertTriangle } from 'lucide-react';
import { Cliente } from '../models/Cliente';
import { Cuenta } from '../models/Cuenta';
import { CuentaAhorros } from '../models/CuentaAhorros';
import { CuentaCorriente } from '../models/CuentaCorriente';
import { TarjetaCredito } from '../models/TarjetaCredito';

interface ModalRetirarProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente;
  cuentaSeleccionadaInicial?: Cuenta;
  onSuccess: (mensaje: string) => void;
}

export const ModalRetirar: React.FC<ModalRetirarProps> = ({
  isOpen,
  onClose,
  cliente,
  cuentaSeleccionadaInicial,
  onSuccess,
}) => {
  const [numeroCuenta, setNumeroCuenta] = useState<string>(
    cuentaSeleccionadaInicial?.numeroCuenta || cliente.cuentas[0]?.numeroCuenta || ''
  );
  const [monto, setMonto] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('Retiro en cajero automático / ventanilla');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const cuentaActual = cliente.obtenerCuenta(numeroCuenta) || cliente.cuentas[0];
  const saldoActual = cuentaActual ? cuentaActual.saldo : 0;
  const montoNum = Number(monto) || 0;
  const limitePermitido = cuentaActual ? cuentaActual.calcularLimiteRetiro() : 0;

  // Cálculos de proyección según el tipo de producto
  const esAhorros = cuentaActual instanceof CuentaAhorros;
  const esCorriente = cuentaActual instanceof CuentaCorriente;
  const esTarjeta = cuentaActual instanceof TarjetaCredito;

  // Si es Ahorros: Rendimiento proyectado del 1.5%
  const rendimientoAhorrosEstimado = esAhorros ? Math.round(saldoActual * 0.015 * 100) / 100 : 0;

  // Si es Corriente: Cupo adicional de 20% sobregiro
  const sobregiroMaximo = esCorriente ? (cuentaActual as CuentaCorriente).calcularCupoSobregiro() : 0;
  const sobregiroRequerido = esCorriente && montoNum > saldoActual ? Math.round((montoNum - saldoActual) * 100) / 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError("Validación requerida: El monto a retirar debe ser mayor a cero.");
      return;
    }

    if (!cuentaActual) {
      setError("No se ha seleccionado una cuenta válida.");
      return;
    }

    // Ejecuta el método polimórfico retirar()
    const resultado = cuentaActual.retirar(montoNum, descripcion);
    if (resultado.exito) {
      onSuccess(resultado.mensaje);
      onClose();
    } else {
      setError(resultado.mensaje);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0a101f] border border-cyan-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Retirar Dinero</h3>
              <p className="text-xs text-slate-400">Disposición de fondos con reglas bancarias activas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Selector de Producto */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Cuenta de Origen
            </label>
            <select
              value={numeroCuenta}
              onChange={(e) => {
                setNumeroCuenta(e.target.value);
                setError(null);
              }}
              className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
            >
              {cliente.cuentas.map((c) => (
                <option key={c.numeroCuenta} value={c.numeroCuenta}>
                  {c.obtenerNombreComercial()} ({c.numeroCuenta}) - Saldo: ${c.saldo.toLocaleString('es-CO')} COP
                </option>
              ))}
            </select>
          </div>

          {/* Banner de Regla de Negocio del Producto Activo */}
          {esAhorros && (
            <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sparkles className="w-4 h-4" />
                Regla Cuenta de Ahorros: Rendimiento del 1.5% Mensual
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                Al procesar el retiro, se liquidará y acreditará a tu saldo un rendimiento mensual del <strong>1.5%</strong> (+${rendimientoAhorrosEstimado.toLocaleString('es-CO')} COP). 
                Restricción: El monto retirado no puede superar tu saldo disponible (${saldoActual.toLocaleString('es-CO')} COP).
              </p>
            </div>
          )}

          {esCorriente && (
            <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                <Info className="w-4 h-4" />
                Regla Cuenta Corriente: Sobregiro Permitido (+20%)
              </div>
              <p className="text-[11px] text-cyan-200/90 leading-relaxed">
                Puedes retirar hasta un 20% adicional sobre tu saldo actual. 
                Saldo base: <strong>${saldoActual.toLocaleString('es-CO')} COP</strong>. 
                Margen de sobregiro: <strong>+${sobregiroMaximo.toLocaleString('es-CO')} COP</strong>. 
                Límite total de retiro: <strong>${limitePermitido.toLocaleString('es-CO')} COP</strong>.
              </p>
            </div>
          )}

          {esTarjeta && (
            <div className="p-3.5 bg-fuchsia-950/30 border border-fuchsia-500/40 rounded-xl text-xs text-fuchsia-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-fuchsia-300">
                <Info className="w-4 h-4" />
                Avance en Efectivo con Tarjeta de Crédito
              </div>
              <p className="text-[11px] text-fuchsia-200/90 leading-relaxed">
                El avance se diferirá a 12 cuotas a tasa preferencial del 2.3% mensual. Cupo disponible: <strong>${limitePermitido.toLocaleString('es-CO')} COP</strong>.
              </p>
            </div>
          )}

          {/* Monto a Retirar */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Monto a Retirar (COP) *
              </label>
              <span className="text-xs text-slate-400 font-mono">
                Límite máximo: <strong className="text-white">${limitePermitido.toLocaleString('es-CO')} COP</strong>
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3 text-cyan-400 font-bold">$</span>
              <input
                type="number"
                step="any"
                min="1000"
                placeholder="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-3 pl-8 text-base text-white font-mono focus:outline-none focus:border-cyan-400"
                autoFocus
              />
            </div>
          </div>

          {/* Alerta si usa Sobregiro */}
          {esCorriente && sobregiroRequerido > 0 && sobregiroRequerido <= sobregiroMaximo && (
            <div className="p-2.5 bg-amber-950/40 border border-amber-600/50 rounded-xl text-[11px] text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Esta operación utilizará <strong>${sobregiroRequerido.toLocaleString('es-CO')} COP</strong> de tu sobregiro operativo autorizado del 20%.
              </span>
            </div>
          )}

          {/* Concepto */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Concepto / Referencia
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Procesar Retiro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
