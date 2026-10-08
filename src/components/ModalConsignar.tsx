/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal Consignar Dinero (Módulo 4.3)
 * Validación de número positivo mayor a cero y actualización de saldo
 */

import React, { useState } from 'react';
import { X, ArrowDownRight, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
import { Cliente } from '../models/Cliente';
import { Cuenta } from '../models/Cuenta';

interface ModalConsignarProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente;
  cuentaSeleccionadaInicial?: Cuenta;
  onSuccess: (mensaje: string) => void;
}

export const ModalConsignar: React.FC<ModalConsignarProps> = ({
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
  const [descripcion, setDescripcion] = useState<string>('Depósito en efectivo / consignación');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const cuentaActual = cliente.obtenerCuenta(numeroCuenta) || cliente.cuentas[0];
  const saldoActual = cuentaActual ? cuentaActual.saldo : 0;
  const montoNum = Number(monto);
  const nuevoSaldoEstimado = saldoActual + (montoNum > 0 ? montoNum : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError("Validación requerida: El monto a consignar debe ser un número positivo mayor a cero.");
      return;
    }

    if (!cuentaActual) {
      setError("No se ha seleccionado una cuenta válida.");
      return;
    }

    const resultado = cuentaActual.consignar(montoNum, descripcion);
    if (resultado.exito) {
      onSuccess(resultado.mensaje);
      onClose();
    } else {
      setError(resultado.mensaje);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0a101f] border border-cyan-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Consignar Dinero</h3>
              <p className="text-xs text-slate-400">Depósito inmediato de fondos a tu cuenta</p>
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
              Cuenta Destino
            </label>
            <select
              value={numeroCuenta}
              onChange={(e) => setNumeroCuenta(e.target.value)}
              className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
            >
              {cliente.cuentas.map((c) => (
                <option key={c.numeroCuenta} value={c.numeroCuenta}>
                  {c.obtenerNombreComercial()} ({c.numeroCuenta}) - Saldo: ${c.saldo.toLocaleString('es-CO')} COP
                </option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Monto a Depositar (COP) *
            </label>
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

          {/* Quick presets en COP */}
          <div className="flex gap-2">
            {[50000, 100000, 500000, 1000000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setMonto(val.toString())}
                className="flex-1 py-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-xs font-mono text-slate-300 cursor-pointer"
              >
                +${val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`}
              </button>
            ))}
          </div>

          {/* Concepto / Descripción */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Concepto / Descripción
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Resumen del Balance Proyectado */}
          <div className="p-3.5 bg-[#060c18] border border-slate-800 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Saldo Actual:</span>
              <span className="font-mono text-white">${saldoActual.toLocaleString('es-CO')} COP</span>
            </div>
            <div className="flex justify-between text-cyan-400 font-semibold">
              <span>Nuevo Saldo Estimado:</span>
              <span className="font-mono">${nuevoSaldoEstimado.toLocaleString('es-CO')} COP</span>
            </div>
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
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Confirmar Depósito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
