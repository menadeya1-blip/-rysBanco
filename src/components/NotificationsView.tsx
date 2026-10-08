/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Vista de Notificaciones &rys Bank
 * Réplica idéntica de la pantalla screenotificaciones.png
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCheck, 
  SlidersHorizontal, 
  ArrowDownLeft, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Sparkles, 
  Bell, 
  Inbox,
  Check
} from 'lucide-react';
import { Cliente, NotificacionBancaria } from '../models/Cliente';

interface NotificationsViewProps {
  cliente: Cliente;
  onBack: () => void;
  onUpdate: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  cliente,
  onBack,
  onUpdate,
}) => {
  const [filter, setFilter] = useState<'TODAS' | 'TRANSACCION' | 'SEGURIDAD' | 'RECOMPENSA'>('TODAS');

  const todas = cliente.notificaciones;
  const noLeidas = todas.filter(n => !n.leida).length;

  const filtradas = todas.filter(n => {
    if (filter === 'TODAS') return true;
    return n.tipo === filter;
  });

  const handleMarcarLeidas = () => {
    cliente.marcarTodasNotificacionesLeidas();
    onUpdate();
  };

  return (
    <div className="w-full max-w-xl mx-auto min-h-screen bg-[#060b14] text-white p-4 sm:p-6 pb-24">
      {/* Header (fiel a screenotificaciones.png) */}
      <div className="flex items-center justify-between py-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Notificaciones</h2>
            {noLeidas > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                {noLeidas}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <button
            onClick={handleMarcarLeidas}
            title="Marcar todas como leídas"
            className="p-2 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-xl hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs segmentadas (fiel a screenotificaciones.png) */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setFilter('TODAS')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'TODAS'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('TRANSACCION')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'TRANSACCION'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Transacciones
        </button>
        <button
          onClick={() => setFilter('SEGURIDAD')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'SEGURIDAD'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Seguridad
        </button>
        <button
          onClick={() => setFilter('RECOMPENSA')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'RECOMPENSA'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Recompensas
        </button>
      </div>

      {/* Lista de eventos */}
      <div className="space-y-3">
        {filtradas.length === 0 ? (
          <div className="text-center py-16 bg-[#0a101e] border border-slate-800 rounded-3xl p-8">
            <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No hay notificaciones en este filtro</h3>
            <p className="text-xs text-slate-500 mt-1">Los eventos de tu banca aparecerán aquí.</p>
          </div>
        ) : (
          filtradas.map((item) => {
            const esPositivo = item.tipo === 'TRANSACCION' && item.monto && item.titulo.toLowerCase().includes('recib');
            const esGasto = item.tipo === 'TRANSACCION' && item.monto && !item.titulo.toLowerCase().includes('recib') && !item.titulo.toLowerCase().includes('nómina');

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.leida
                    ? 'bg-[#090f1d]/60 border-slate-800/80'
                    : 'bg-[#0e172c]/90 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Icono por categoría */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.tipo === 'TRANSACCION'
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                      : item.tipo === 'SEGURIDAD'
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      : 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400'
                  }`}>
                    {item.tipo === 'TRANSACCION' && <ArrowDownLeft className="w-5 h-5" />}
                    {item.tipo === 'SEGURIDAD' && <ShieldCheck className="w-5 h-5" />}
                    {item.tipo === 'RECOMPENSA' && <Sparkles className="w-5 h-5" />}
                    {item.tipo === 'SISTEMA' && <SlidersHorizontal className="w-5 h-5" />}
                  </div>

                  {/* Cuerpo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.titulo}
                      </h4>
                      {item.monto !== undefined && (
                        <span className={`text-xs sm:text-sm font-bold font-mono shrink-0 ${
                          esPositivo || item.titulo.includes('Nómina') || item.titulo.includes('Cashback')
                            ? 'text-emerald-400'
                            : 'text-white'
                        }`}>
                          {item.titulo.includes('Compra') ? '-' : '+'}${item.monto.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.mensaje}
                    </p>

                    <div className="flex items-center gap-2 mt-2.5">
                      {item.estadoBadge && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          <Check className="w-3 h-3 text-cyan-400" />
                          {item.estadoBadge}
                        </span>
                      )}
                      {item.categoriaTag && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.categoriaTag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Widget "Al día con todo" (fiel a screenotificaciones.png) */}
      <div className="mt-12 text-center p-6 bg-[#080d1a] border border-slate-800/80 rounded-3xl">
        <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <Inbox className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-white">Al día con todo</h4>
        <p className="text-xs text-slate-400 mt-1">
          Has revisado las notificaciones y movimientos de los últimos 30 días.
        </p>
        <button
          type="button"
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs text-slate-200 font-semibold flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5 text-cyan-400" />
          Configurar alertas
        </button>
      </div>
    </div>
  );
};
