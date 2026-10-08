/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Simulador Financiero &rys Banco
 * Herramienta de proyección financiera en pesos colombianos (COP)
 */

import React, { useState, useId } from 'react';
import { TrendingUp, CreditCard, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface SimulatorProps {
  onOpenAccount?: () => void;
  onExploreProducts?: () => void;
}

export const FinancialSimulator: React.FC<SimulatorProps> = ({ onOpenAccount }) => {
  const [activeTab, setActiveTab] = useState<'ahorro' | 'tarjeta'>('ahorro');
  const [montoAhorro, setMontoAhorro] = useState<number>(2000000);
  const [plazoAhorro, setPlazoAhorro] = useState<number>(12); // meses

  const [montoTarjeta, setMontoTarjeta] = useState<number>(1500000);
  const [cuotasTarjeta, setCuotasTarjeta] = useState<number>(6);

  const ahorroMontoId = useId();
  const ahorroPlazoId = useId();
  const tarjetaMontoId = useId();
  const tarjetaCuotasId = useId();

  // Tasa fija mensual de cuenta de ahorros (1.5%)
  const TASA_MENSUAL_AHORROS = 0.015;

  // Cálculo de Ahorros con capitalización mensual
  const calcularAhorro = () => {
    let saldo = montoAhorro;
    const puntos = [{ mes: 0, saldo }];
    for (let i = 1; i <= plazoAhorro; i++) {
      saldo = saldo * (1 + TASA_MENSUAL_AHORROS);
      puntos.push({ mes: i, saldo });
    }
    const capitalFinal = saldo;
    const rendimientoNeto = capitalFinal - montoAhorro;
    return {
      capitalFinal,
      rendimientoNeto,
      puntos,
    };
  };

  // Cálculo de Tarjeta de Crédito con las reglas de negocio
  const calcularTarjeta = () => {
    let tasa = 0;
    let tasaLabel = '0% (Sin interés)';
    if (cuotasTarjeta <= 2) {
      tasa = 0.0;
      tasaLabel = '0.0% mensual';
    } else if (cuotasTarjeta <= 6) {
      tasa = 0.019;
      tasaLabel = '1.9% mensual (Interés moderado)';
    } else {
      tasa = 0.023;
      tasaLabel = '2.3% mensual (Interés alto)';
    }

    let cuotaMensual = 0;
    let totalPagar = 0;

    if (tasa === 0) {
      cuotaMensual = montoTarjeta / cuotasTarjeta;
      totalPagar = montoTarjeta;
    } else {
      const factor = Math.pow(1 + tasa, -cuotasTarjeta);
      cuotaMensual = (montoTarjeta * tasa) / (1 - factor);
      totalPagar = cuotaMensual * cuotasTarjeta;
    }

    const interesesTotales = Math.max(0, totalPagar - montoTarjeta);

    return {
      cuotaMensual,
      totalPagar,
      interesesTotales,
      tasa,
      tasaLabel,
    };
  };

  const resultadoAhorro = calcularAhorro();
  const resultadoTarjeta = calcularTarjeta();

  return (
    <div id="simulador" className="w-full max-w-5xl mx-auto my-12 px-4">
      {/* Encabezado de la herramienta */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-cyan-400 font-mono">
          HERRAMIENTA INTERACTIVA
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-1 font-display">
          Simulador Financiero &rys
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
          Calcula en tiempo real el crecimiento de tus fondos bajo el modelo de interés mensual de ahorros o la cuota estimada de compras con la tarjeta Obsidian.
        </p>
      </div>

      {/* Tarjeta principal contenedora */}
      <div className="bg-[#0b1324]/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Selector de pestañas */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#070d1a] border border-slate-800/80 rounded-2xl w-fit mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('ahorro')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'ahorro'
                ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 text-cyan-300 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Rendimiento de Ahorro
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tarjeta')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'tarjeta'
                ? 'bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/40 text-fuchsia-300 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-fuchsia-400" />
            Amortización Tarjeta
          </button>
        </div>

        {/* Contenido según pestaña */}
        {activeTab === 'ahorro' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controles del Slider */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Monto Proyectado */}
              <div className="bg-[#070d1a]/80 border border-slate-800/80 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor={ahorroMontoId} className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    MONTO PROYECTADO (COP)
                  </label>
                  <span className="text-xl font-bold font-mono text-cyan-300">
                    ${montoAhorro.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <input
                  id={ahorroMontoId}
                  type="range"
                  min="100000"
                  max="50000000"
                  step="100000"
                  value={montoAhorro}
                  onChange={(e) => setMontoAhorro(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
                  <span>$100.000 COP</span>
                  <span className="text-amber-400 font-semibold">$10.000.000 COP</span>
                  <span>$50.000.000 COP</span>
                </div>
              </div>

              {/* Slider 2: Plazo Temporal */}
              <div className="bg-[#070d1a]/80 border border-slate-800/80 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor={ahorroPlazoId} className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    PLAZO TEMPORAL
                  </label>
                  <span className="text-xl font-bold font-mono text-white">
                    {plazoAhorro} <span className="text-sm font-normal text-slate-400">meses</span>
                  </span>
                </div>
                <input
                  id={ahorroPlazoId}
                  type="range"
                  min="1"
                  max="36"
                  step="1"
                  value={plazoAhorro}
                  onChange={(e) => setPlazoAhorro(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
                  <span className="text-emerald-400">1 mes</span>
                  <span>12 meses</span>
                  <span>36 meses</span>
                </div>
              </div>

              {/* Nota explicativa de negocio */}
              <div className="flex items-start gap-3 p-4 bg-cyan-950/20 border border-cyan-800/30 rounded-xl text-xs text-cyan-200/90 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  En modalidad de Ahorro, tus fondos devengan <strong>1.5% mensual fijo</strong> (equivalente a 19.56% E.A.) calculado y aplicado en el momento de liquidación o retiro, sin periodos de congelación forzosa.
                </p>
              </div>
            </div>

            {/* Tarjeta de Resultados */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#0e192f] to-[#070d19] border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  ESTIMACIÓN DE RENDIMIENTO
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-emerald-400 text-black shadow">
                  Tasa: 1.50% / mes
                </span>
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-400">Capital Total Proyectado</div>
                <div className="text-3xl font-extrabold text-cyan-300 font-mono tracking-tight mt-1">
                  ${resultadoAhorro.capitalFinal.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} <span className="text-sm font-normal text-slate-400">COP</span>
                </div>
              </div>

              {/* Submétricas */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#080f1e] p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    GANANCIA NETA
                  </div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    +${resultadoAhorro.rendimientoNeto.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="bg-[#080f1e] p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    TASA EFECTIVA ANUAL
                  </div>
                  <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                    +19.56% E.A.
                  </div>
                </div>
              </div>

              {/* Mini gráfico visual de curva de rendimiento */}
              <div className="h-16 w-full mb-6 bg-[#060c18] rounded-xl p-2 border border-slate-800/80 flex items-end justify-between gap-1">
                {resultadoAhorro.puntos.filter((_, idx) => idx % Math.ceil(plazoAhorro / 12) === 0).map((pt, i) => {
                  const alturaPct = Math.max(15, Math.min(100, ((pt.saldo - montoAhorro) / (resultadoAhorro.rendimientoNeto || 1)) * 85 + 15));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div
                        style={{ height: `${alturaPct}%` }}
                        className="w-full rounded-t bg-gradient-to-t from-cyan-600 to-emerald-400 group-hover:from-cyan-400 group-hover:to-teal-300 transition-all"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Botón de acción */}
              <button
                type="button"
                onClick={onOpenAccount}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Comenzar a rentabilizar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controles de Tarjeta */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider Monto de Compra */}
              <div className="bg-[#070d1a]/80 border border-slate-800/80 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor={tarjetaMontoId} className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    VALOR DE LA COMPRA / CRÉDITO (COP)
                  </label>
                  <span className="text-xl font-bold font-mono text-fuchsia-400">
                    ${montoTarjeta.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <input
                  id={tarjetaMontoId}
                  type="range"
                  min="50000"
                  max="20000000"
                  step="50000"
                  value={montoTarjeta}
                  onChange={(e) => setMontoTarjeta(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
                  <span>$50.000 COP</span>
                  <span className="text-fuchsia-400">$5.000.000 COP</span>
                  <span>$20.000.000 COP</span>
                </div>
              </div>

              {/* Selector de Cuotas */}
              <div className="bg-[#070d1a]/80 border border-slate-800/80 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor={tarjetaCuotasId} className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    NÚMERO DE CUOTAS
                  </label>
                  <span className="text-xl font-bold font-mono text-white">
                    {cuotasTarjeta} <span className="text-sm font-normal text-slate-400">meses</span>
                  </span>
                </div>
                <input
                  id={tarjetaCuotasId}
                  type="range"
                  min="1"
                  max="36"
                  step="1"
                  value={cuotasTarjeta}
                  onChange={(e) => setCuotasTarjeta(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
                  <span className="text-emerald-400 font-semibold">1-2 (0% Tasa)</span>
                  <span className="text-amber-400">3-6 (1.9% Tasa)</span>
                  <span className="text-rose-400">7-36 (2.3% Tasa)</span>
                </div>
              </div>

              {/* Desglose de Políticas de Tarjeta */}
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className={`p-3 rounded-xl border ${cuotasTarjeta <= 2 ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}>
                  <div className="font-bold text-[13px]">≤ 2 Cuotas</div>
                  <div className="text-[11px] mt-0.5">0% Interés mensual</div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Sin costo de financiación</div>
                </div>

                <div className={`p-3 rounded-xl border ${cuotasTarjeta >= 3 && cuotasTarjeta <= 6 ? 'bg-amber-950/40 border-amber-500/60 text-amber-200' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}>
                  <div className="font-bold text-[13px]">3 a 6 Cuotas</div>
                  <div className="text-[11px] mt-0.5">1.9% mensual</div>
                  <div className="text-[10px] text-amber-400 mt-1 font-semibold">Interés moderado</div>
                </div>

                <div className={`p-3 rounded-xl border ${cuotasTarjeta >= 7 ? 'bg-rose-950/40 border-rose-500/60 text-rose-200' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}>
                  <div className="font-bold text-[13px]">≥ 7 Cuotas</div>
                  <div className="text-[11px] mt-0.5">2.3% mensual</div>
                  <div className="text-[10px] text-rose-400 mt-1 font-semibold">Interés estándar crédito</div>
                </div>
              </div>
            </div>

            {/* Resultados Tarjeta */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#1c1228] to-[#0d0916] border border-fuchsia-500/30 rounded-2xl p-6 shadow-xl relative">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  PAGO MENSUAL ESTIMADO
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${cuotasTarjeta <= 2 ? 'bg-emerald-400 text-black' : 'bg-fuchsia-500/30 border border-fuchsia-500/50 text-fuchsia-200'}`}>
                  {resultadoTarjeta.tasa === 0 ? '0% Tasa Cero' : `${(resultadoTarjeta.tasa * 100).toFixed(1)}% / mes`}
                </span>
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-400">Valor de cada Cuota Mensual</div>
                <div className="text-3xl font-extrabold text-fuchsia-300 font-mono tracking-tight mt-1">
                  ${resultadoTarjeta.cuotaMensual.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} <span className="text-sm font-normal text-slate-400">COP/mes</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#120a1d] p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    TOTAL A PAGAR
                  </div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    ${resultadoTarjeta.totalPagar.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="bg-[#120a1d] p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    INTERESES TOTALES
                  </div>
                  <div className={`text-base font-bold font-mono mt-0.5 ${resultadoTarjeta.interesesTotales === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ${resultadoTarjeta.interesesTotales.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-black/40 border border-slate-800/80 rounded-xl mb-6 text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Fórmula aplicada:</span>
                  <span className="font-mono text-cyan-400 text-[11px]">{resultadoTarjeta.tasa === 0 ? 'Capital / n' : 'Capital × i / (1 - (1+i)⁻ⁿ)'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plazo seleccionado:</span>
                  <span className="text-slate-200 font-medium">{cuotasTarjeta} cuotas mensuales</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenAccount}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-400 text-slate-950 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/20 cursor-pointer"
              >
                Solicitar Tarjeta de Crédito
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
