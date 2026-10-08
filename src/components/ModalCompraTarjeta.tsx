/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal Compras con Tarjeta de Crédito Obsidian (Requisitos 3.3 y 5.4)
 * Calcula y muestra el pago mensual según la fórmula matemática oficial
 */

import React, { useState } from 'react';
import { X, CreditCard, Sparkles, AlertCircle, ShoppingBag, Calculator } from 'lucide-react';
import { Cliente } from '../models/Cliente';
import { TarjetaCredito } from '../models/TarjetaCredito';

interface ModalCompraTarjetaProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente;
  onSuccess: (mensaje: string) => void;
}

export const ModalCompraTarjeta: React.FC<ModalCompraTarjetaProps> = ({
  isOpen,
  onClose,
  cliente,
  onSuccess,
}) => {
  const tarjeta = cliente.tarjetaCredito;

  const [monto, setMonto] = useState<string>('450');
  const [cuotas, setCuotas] = useState<number>(3);
  const [comercio, setComercio] = useState<string>('Apple Store Online');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !tarjeta) return null;

  const montoNum = Number(monto) || 0;
  const calculo = tarjeta.calcularCuotaMensual(montoNum, cuotas);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError("El valor de la compra debe ser un número positivo mayor a cero.");
      return;
    }

    if (montoNum > tarjeta.cupoDisponible) {
      setError(`Cupo insuficiente. Tu cupo disponible actual es de $${tarjeta.cupoDisponible.toLocaleString('es-CO')} COP.`);
      return;
    }

    const res = tarjeta.realizarCompra(montoNum, cuotas, comercio.trim() || 'Comercio General');
    if (res.exito) {
      onSuccess(res.mensaje);
      onClose();
    } else {
      setError(res.mensaje);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0f0a1c] border border-fuchsia-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Compra con Tarjeta de Crédito</h3>
              <p className="text-xs text-slate-400">Financiamiento a cuotas con cálculo financiero en tiempo real</p>
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

          {/* Información de Cupo */}
          <div className="p-3 bg-[#0a0514] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Tarjeta: </span>
              <span className="font-mono text-white font-semibold">{tarjeta.numeroTarjetaVisible}</span>
            </div>
            <div>
              <span className="text-slate-400">Cupo Disponible: </span>
              <span className="font-mono text-emerald-400 font-bold">${tarjeta.cupoDisponible.toLocaleString('es-CO')} COP</span>
            </div>
          </div>

          {/* Comercio */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Establecimiento o Comercio
            </label>
            <div className="relative">
              <input
                type="text"
                value={comercio}
                onChange={(e) => setComercio(e.target.value)}
                placeholder="ej: Amazon, Apple Store, Supermercado..."
                className="w-full bg-[#07030e] border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-fuchsia-400"
              />
              <ShoppingBag className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Monto de la compra */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Valor de la Compra (COP) *
            </label>
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

          {/* Selector de Cuotas */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Número de Cuotas
              </label>
              <span className="text-xs font-bold text-fuchsia-300 font-mono">
                {cuotas} {cuotas === 1 ? 'cuota' : 'cuotas'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="36"
              value={cuotas}
              onChange={(e) => setCuotas(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span className="text-emerald-400">1-2 cuotas (0%)</span>
              <span className="text-amber-400">3-6 cuotas (1.9%)</span>
              <span className="text-rose-400">7-36 cuotas (2.3%)</span>
            </div>
          </div>

          {/* Tarjeta de Cálculo Oficial de Cuota Mensual (Requisito 3.3) */}
          <div className="p-4 bg-gradient-to-br from-[#190c2a] to-[#0a0514] border border-fuchsia-500/40 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-fuchsia-400" />
                Valor del Pago Mensual Resultante:
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${calculo.tasaMensualDecimal === 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800'}`}>
                Tasa: {calculo.tasaMensualDecimal === 0 ? '0% Sin Interés' : `${calculo.tasaMensualPorcentaje} mensual`}
              </span>
            </div>

            <div className="text-3xl font-extrabold text-fuchsia-300 font-mono tracking-tight">
              ${calculo.cuotaMensual.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} <span className="text-sm font-normal text-slate-400">COP/mes</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Total a Pagar:</span>
                <span className="font-mono font-bold text-white">${calculo.totalPagar.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Intereses Financieros:</span>
                <span className={`font-mono font-bold ${calculo.interesesTotales === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  ${calculo.interesesTotales.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP
                </span>
              </div>
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
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-fuchsia-500/20 transition-all cursor-pointer"
            >
              Autorizar Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
