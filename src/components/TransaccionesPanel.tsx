/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Módulo 4.3 Panel de Transacciones (Panel del Cajero)
 * Fiel a las capturas Image 1.jpeg y screenotificaciones.png
 */

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowDownRight, 
  ArrowUpRight, 
  ArrowRightLeft, 
  CreditCard, 
  MoreHorizontal, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  Monitor, 
  Calendar, 
  Download, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Layers,
  Sparkles,
  Cpu
} from 'lucide-react';
import { Cliente } from '../models/Cliente';
import { Cuenta } from '../models/Cuenta';
import { CuentaAhorros } from '../models/CuentaAhorros';
import { CuentaCorriente } from '../models/CuentaCorriente';
import { TarjetaCredito } from '../models/TarjetaCredito';
import { Transaccion } from '../models/Transaccion';

interface TransaccionesPanelProps {
  cliente: Cliente;
  onOpenConsignar: (cuenta?: Cuenta) => void;
  onOpenRetirar: (cuenta?: Cuenta) => void;
  onOpenTransferir: () => void;
  onOpenCompraTarjeta: () => void;
  onOpenPagarTarjeta: () => void;
  onOpenNotificaciones: () => void;
  onOpenPerfil: () => void;
  onOpenAudit: () => void;
}

export const TransaccionesPanel: React.FC<TransaccionesPanelProps> = ({
  cliente,
  onOpenConsignar,
  onOpenRetirar,
  onOpenTransferir,
  onOpenCompraTarjeta,
  onOpenPagarTarjeta,
  onOpenNotificaciones,
  onOpenPerfil,
  onOpenAudit,
}) => {
  const [ocultarSaldo, setOcultarSaldo] = useState(false);
  const [cuentaActivaIndex, setCuentaActivaIndex] = useState(0);
  const [filtroCategoria, setFiltroCategoria] = useState<'Todo' | 'Ingreso' | 'Gasto' | 'Inversión' | 'Crédito'>('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [vistaMobileMockup, setVistaMobileMockup] = useState(false);

  const cuentaActiva = cliente.cuentas[cuentaActivaIndex] || cliente.cuentas[0];
  const notificacionesNoLeidas = cliente.notificaciones.filter(n => !n.leida).length;

  // Movimientos unificados ordenados cronológicamente descendente (List<T> o Array)
  const todosMovimientos = cliente.cuentas.flatMap(c => c.consultarMovimientos())
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

  // Filtrado de movimientos
  const movimientosFiltrados = todosMovimientos.filter(m => {
    const coincideFiltro = filtroCategoria === 'Todo' || m.categoria === filtroCategoria;
    const coincideBusqueda = !busqueda || 
      m.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.tipo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Selector de modo de visualización: Desktop / Simulación Móvil (fiel a Image 1.jpeg) */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono text-cyan-400">VISTA:</span>
          <button
            onClick={() => setVistaMobileMockup(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              !vistaMobileMockup ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Panel Escritorio
          </button>
          <button
            onClick={() => setVistaMobileMockup(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              vistaMobileMockup ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Modo Móvil (&rys Mobile)
          </button>
        </div>

        <button
          onClick={onOpenAudit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-mono hover:bg-cyan-900/60 cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          Auditoría POO
        </button>
      </div>

      {/* Contenedor condicional (si está en modo móvil se muestra un elegante marco de smartphone) */}
      <div className={vistaMobileMockup ? 'max-w-md mx-auto bg-[#060b14] border-4 border-slate-800 rounded-[42px] p-5 shadow-2xl relative overflow-hidden' : 'space-y-8'}>
        
        {/* HEADER DEL CAJERO (fiel a Image 1.jpeg) */}
        <div className="flex items-center justify-between pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Hola, {cliente.nombreCompleto.split(' ')[0]}
              </h2>
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">
                ✓
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">{cliente.tier}</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                CIFRADO 256-BIT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenNotificaciones}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {notificacionesNoLeidas > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                  {notificacionesNoLeidas}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TARJETA DE PATRIMONIO TOTAL DISPONIBLE (fiel a Image 1.jpeg) */}
        <div className="bg-gradient-to-br from-[#0c162a] via-[#091120] to-[#050912] border border-cyan-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
              PATRIMONIO TOTAL DISPONIBLE
            </span>
            <button
              onClick={() => setOcultarSaldo(!ocultarSaldo)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              {ocultarSaldo ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Mostrar</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Ocultar</span>
                </>
              )}
            </button>
          </div>

          {/* Valor Principal */}
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight my-2">
            {ocultarSaldo ? (
              '••••••••'
            ) : (
              `$${cliente.patrimonioLiquidoTotal.toLocaleString('es-CO', { minimumFractionDigits: 0 })}`
            )}
            <span className="text-sm font-normal text-slate-400 ml-1.5">COP</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Rendimiento mensual de liquidez (+1.5% mensual)</span>
          </div>
        </div>

        {/* SELECTOR DE PRODUCTOS (Cuentas del Cliente) */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold">
              MIS PRODUCTOS BANCARIOS
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              {cuentaActivaIndex + 1} de {cliente.cuentas.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cliente.cuentas.map((cta, idx) => {
              const esSeleccionada = idx === cuentaActivaIndex;
              const esAhorros = cta instanceof CuentaAhorros;
              const esCorriente = cta instanceof CuentaCorriente;
              const esTarjeta = cta instanceof TarjetaCredito;

              return (
                <button
                  key={cta.numeroCuenta}
                  type="button"
                  onClick={() => setCuentaActivaIndex(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    esSeleccionada
                      ? 'bg-[#0f1b33] border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                      : 'bg-[#090f1d] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">
                      {cta.numeroCuenta}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      esAhorros ? 'bg-amber-950 text-amber-300' : esCorriente ? 'bg-cyan-950 text-cyan-300' : 'bg-fuchsia-950 text-fuchsia-300'
                    }`}>
                      {esAhorros ? '+1.5% Rendimiento' : esCorriente ? '+20% Sobregiro' : 'Tarjeta de Crédito'}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-300">
                    {cta.obtenerNombreComercial()}
                  </div>

                  <div className="text-lg font-bold font-mono text-white mt-1">
                    {ocultarSaldo ? '••••••' : `$${cta.saldo.toLocaleString('es-CO')} COP`}
                  </div>

                  {esAhorros && (
                    <div className="text-[11px] text-amber-400/90 mt-1">
                      Genera 1.5% mensual aplicado al retiro
                    </div>
                  )}

                  {esCorriente && (
                    <div className="text-[11px] text-cyan-300 mt-1">
                      Límite con sobregiro: ${cta.calcularLimiteRetiro().toLocaleString('es-CO')} COP
                    </div>
                  )}

                  {esTarjeta && (
                    <div className="text-[11px] text-fuchsia-300 mt-1">
                      Deuda: ${(cta as TarjetaCredito).deudaActual.toLocaleString('es-CO')} COP
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACCIONES RÁPIDAS DE TRANSACCIÓN (fiel a Image 1.jpeg) */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 mb-8">
          {/* 1. Consignar */}
          <button
            type="button"
            onClick={() => onOpenConsignar(cuentaActiva)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#091120] border border-slate-800 hover:border-emerald-500/50 hover:bg-[#0c172c] transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-1.5">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Consignar</span>
          </button>

          {/* 2. Retirar */}
          <button
            type="button"
            onClick={() => onOpenRetirar(cuentaActiva)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#091120] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c172c] transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-1.5">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Retirar</span>
          </button>

          {/* 3. Transferir */}
          <button
            type="button"
            onClick={onOpenTransferir}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#091120] border border-slate-800 hover:border-blue-500/50 hover:bg-[#0c172c] transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-1.5">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Transferir</span>
          </button>

          {/* 4. Tarjeta / Compras a cuotas */}
          <button
            type="button"
            onClick={onOpenCompraTarjeta}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#091120] border border-slate-800 hover:border-fuchsia-500/50 hover:bg-[#0c172c] transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform mb-1.5">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-200">Comprar</span>
          </button>
        </div>

        {/* BANNER DE ÚLTIMA TRANSFERENCIA DESTACADA (fiel a Image 1.jpeg) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a1525] to-cyan-950/40 border border-emerald-500/30 flex items-center justify-between mb-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white">Transferencias Inmediatas &rys:</span>
              <span className="text-slate-300 ml-1.5">Sin comisiones bancarias entre productos y usuarios.</span>
            </div>
          </div>
          <button
            onClick={onOpenPagarTarjeta}
            className="text-[11px] font-bold text-fuchsia-300 hover:underline px-2.5 py-1 bg-fuchsia-950/50 rounded-lg border border-fuchsia-800 shrink-0 cursor-pointer"
          >
            Pagar Tarjeta
          </button>
        </div>

        {/* SECCIÓN DE HISTORIAL DE MOVIMIENTOS (fiel a Image 1.jpeg) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white font-display">Movimientos</h3>

            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar por concepto o tipo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-1.5 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Filtros segmentados interactivos (fiel a Image 1.jpeg) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {(['Todo', 'Ingreso', 'Gasto', 'Inversión', 'Crédito'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltroCategoria(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filtroCategoria === cat
                    ? 'bg-gradient-to-r from-pink-500 to-cyan-400 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'Todo' ? 'Todo' : `${cat}s`}
              </button>
            ))}
          </div>

          {/* Lista de Transacciones */}
          <div className="space-y-2.5">
            {movimientosFiltrados.length === 0 ? (
              <div className="text-center py-12 bg-[#090f1d] border border-slate-800 rounded-2xl p-6">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No se encontraron movimientos con los filtros seleccionados.</p>
              </div>
            ) : (
              movimientosFiltrados.map((m) => {
                const esIngreso = m.categoria === 'Ingreso' || m.categoria === 'Inversión';
                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-[#080e1c] border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        esIngreso
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        {esIngreso ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white truncate">
                          {m.descripcion}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{m.fechaCorta}</span>
                          <span>•</span>
                          <span className="text-cyan-400">{m.estado}</span>
                          {m.detalles?.cuotas && (
                            <>
                              <span>•</span>
                              <span className="text-fuchsia-400">{m.detalles.cuotas} cuotas</span>
                            </>
                          )}
                          {m.detalles?.sobregiroUsado && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400">Sobregiro ${m.detalles.sobregiroUsado}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-xs sm:text-sm font-extrabold font-mono ${
                        esIngreso ? 'text-emerald-400' : 'text-slate-100'
                      }`}>
                        {esIngreso ? '+' : '-'}${m.monto.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                        <span className="text-[10px] font-normal text-slate-400 ml-1">COP</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Saldo: ${m.saldoPosterior.toLocaleString('es-CO')}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* BARRA INFERIOR MÓVIL (fiel a Image 1.jpeg) */}
        {vistaMobileMockup && (
          <div className="mt-8 pt-3 border-t border-slate-800 flex items-center justify-around text-[10px] font-mono font-bold text-slate-400">
            <button className="flex flex-col items-center gap-1 text-cyan-400">
              <Monitor className="w-4 h-4" />
              <span>INICIO</span>
            </button>
            <button onClick={onOpenTransferir} className="flex flex-col items-center gap-1 hover:text-white">
              <ArrowRightLeft className="w-4 h-4" />
              <span>TRANSFERIR</span>
            </button>
            <button onClick={onOpenCompraTarjeta} className="flex flex-col items-center gap-1 hover:text-white">
              <CreditCard className="w-4 h-4" />
              <span>TARJETA</span>
            </button>
            <button onClick={onOpenPerfil} className="flex flex-col items-center gap-1 hover:text-white">
              <ShieldCheck className="w-4 h-4" />
              <span>PERFIL</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
