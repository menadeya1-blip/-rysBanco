/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal Pagar Tarjeta de Crédito (Amortización de Deuda)
 */

import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, AlertCircle, ArrowDownCircle } from 'lucide-react';
import { Cliente } from '../models/Cliente';
import { TarjetaCredito } from '../models/TarjetaCredito';

interface ModalPagarTarjetaProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente;
  onSuccess: (mensaje: string) => void;
}

export const ModalPagarTarjeta: React.FC<ModalPagarTarjetaProps> = ({
  isOpen,
  onClose,
  cliente,
  onSuccess,
}) => {
  const tarjeta = cliente.tarjetaCredito;
  const [cuentaDebito, setCuentaDebito] = useState<string>(cliente.cuentas[0]?.numeroCuenta || '');
  const [monto, setMonto] = useState<string>(tarjeta ? tarjeta.deudaActual.toString() : '0');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !tarjeta) return null;

  const montoNum = Number(monto) || 0;
  const cuentaDebitoObj = cliente.obtenerCuenta(cuentaDebito);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tarjeta.deudaActual <= 0) {
      setError("No tienes deuda pendiente en tu Tarjeta Obsidian Metal.");
      return;
    }

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError("Ingresa un monto positivo para pagar la tarjeta.");
      return;
    }

    if (!cuentaDebitoObj) {
      setError("Selecciona la cuenta con la que deseas pagar la tarjeta.");
      return;
    }

    if (cuentaDebitoObj.numeroCuenta === tarjeta.numeroCuenta) {
      setError("No puedes pagar la tarjeta debitando de la misma tarjeta.");
      return;
    }

    // Debita de la cuenta origen
    const debito = cuentaDebitoObj.retirar(montoNum, `Pago de Tarjeta Obsidian (${tarjeta.numeroCuenta})`);
    if (!debito.exito) {
      setError(debito.mensaje);
      return;
    }

    // Abona a la tarjeta
    const res = tarjeta.pagarTarjeta(montoNum, `Abono desde cuenta ${cuentaDebitoObj.obtenerNombreComercial()}`);
    if (res.exito) {
      onSuccess(res.mensaje);
      onClose();
    } else {
      setError(res.mensaje);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0f0a1c] border border-fuchsia-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Pagar Tarjeta de Crédito</h3>
              <p className="text-xs text-slate-400">Amortiza tu saldo deudor y restaura tu cupo disponible</p>
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

          {/* Resumen de deuda */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-black/50 border border-slate-800 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">DEUDA ACTUAL:</span>
              <span className="text-base font-bold font-mono text-rose-400">
                ${tarjeta.deudaActual.toLocaleString('es-CO')} COP
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">CUPO DISPONIBLE:</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                ${tarjeta.cupoDisponible.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          {/* Cuenta con la que paga */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Pagar desde mi cuenta:
            </label>
            <select
              value={cuentaDebito}
              onChange={(e) => setCuentaDebito(e.target.value)}
              className="w-full bg-[#07030e] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-400 font-mono"
            >
              {cliente.cuentas.filter(c => c.obtenerTipo() !== 'TARJETA_CREDITO').map((c) => (
                <option key={c.numeroCuenta} value={c.numeroCuenta}>
                  {c.obtenerNombreComercial()} ({c.numeroCuenta}) - Saldo: ${c.saldo.toLocaleString('es-CO')} COP
                </option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Monto a Pagar (COP) *
              </label>
              <button
                type="button"
                onClick={() => setMonto(tarjeta.deudaActual.toString())}
                className="text-xs font-bold text-fuchsia-400 hover:underline"
              >
                Pagar total deuda
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3 text-fuchsia-400 font-bold">$</span>
              <input
                type="number"
                step="any"
                min="1000"
                placeholder="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full bg-[#07030e] border border-slate-700 rounded-xl px-4 py-3 pl-8 text-base text-white font-mono focus:outline-none focus:border-fuchsia-400"
              />
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
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-fuchsia-500/20 transition-all cursor-pointer"
            >
              Confirmar Abono
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
