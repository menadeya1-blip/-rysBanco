/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Landing Page Corporativa &rys Bank
 * Réplica idéntica y enriquecida de screenDiseñoweb.png
 */

import React from 'react';
import { FinancialSimulator } from './FinancialSimulator';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Fingerprint, 
  Radio, 
  Snowflake, 
  Headphones, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Briefcase
} from 'lucide-react';

interface LandingPageProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onOpenAudit: () => void;
  onQuickDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenRegister,
  onOpenLogin,
  onOpenAudit,
  onQuickDemo,
}) => {
  return (
    <div className="w-full bg-[#050911] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* 1. SECCIÓN HERO */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        {/* Glows ambientales de fondo */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[450px] h-[450px] bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Columna Izquierda: Copywriting e Invocación */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge superior Bancario */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-emerald-300">Banca Digital Colombiana</span>
                <span className="text-slate-500">•</span>
                <span>Vigilado Superintendencia Financiera</span>
              </div>

              {/* Titular Impactante */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-display">
                Tus <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">metas financieras</span>, en todos los <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">colores</span> del <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">éxito</span>.
              </h1>

              {/* Subtítulo institucional */}
              <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed font-light">
                En &rys Banco unimos la tecnología, la seguridad y la calidez humana para ofrecer un espacio donde cada miembro de la familia &rys encuentre su lugar.
              </p>

              {/* Botones de acción principales */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-cyan-500/25 cursor-pointer"
                >
                  Crear cuenta nueva
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#simulador"
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-[#0c1527] border border-slate-700/80 text-white hover:border-cyan-500/50 hover:bg-[#101b33] transition-all flex items-center gap-2 cursor-pointer"
                >
                  Explorar simulador
                </a>

                <button
                  type="button"
                  onClick={onQuickDemo}
                  className="px-4 py-3.5 rounded-xl font-mono text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 hover:bg-cyan-900/40 transition-colors cursor-pointer"
                  title="Acceso directo sin contraseña como David Morales"
                >
                  ⚡ Acceso Demo
                </button>
              </div>

              {/* Badges de Confianza Corporativos (fieles a screenDiseñoweb.png) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="bg-[#090f1d]/90 border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Cifrado 256-Bit</div>
                    <div className="text-[10px] text-slate-400">Protocolos FIPS 140-2</div>
                  </div>
                </div>

                <div className="bg-[#090f1d]/90 border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Auditoría Big 4</div>
                    <div className="text-[10px] text-slate-400">Pruebas trimestrales SOC 2</div>
                  </div>
                </div>

                <div className="bg-[#090f1d]/90 border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Soporte 24/7/365</div>
                    <div className="text-[10px] text-slate-400">Banquero privado en app</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta Obsidian Metal 3D Visual (fiel a screenDiseñoweb.png) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md group perspective-1000">
                {/* Glow posterior de la tarjeta */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-500 opacity-30 group-hover:opacity-60 blur-xl transition-all duration-500" />

                {/* Tarjeta Física Obsidian */}
                <div className="relative bg-gradient-to-br from-[#121c2e] via-[#09101d] to-[#040810] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-2xl">
                  {/* Encabezado tarjeta */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xl text-white tracking-tight font-display">&rys</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                        OBSIDIAN METAL
                      </span>
                    </div>
                    {/* Icono contactless */}
                    <Radio className="w-5 h-5 text-amber-400" />
                  </div>

                  {/* Chip NFC Core 3.0 con dorado metálico */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-9 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-300/80 p-1 flex flex-col justify-between shadow-inner">
                      <div className="h-0.5 w-full bg-amber-700/40 rounded-full" />
                      <div className="h-0.5 w-full bg-amber-700/40 rounded-full" />
                      <div className="h-0.5 w-full bg-amber-700/40 rounded-full" />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 font-semibold">
                      NFC CORE 3.0
                    </span>
                  </div>

                  {/* Número de tarjeta en relieve */}
                  <div className="font-mono text-lg sm:text-xl tracking-[0.25em] text-slate-100 font-bold mb-6 drop-shadow">
                    •••• •••• •••• 9284
                  </div>

                  {/* Datos del titular */}
                  <div className="flex items-end justify-between border-t border-slate-800/80 pt-4">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">TITULAR</div>
                      <div className="font-semibold text-xs text-white uppercase tracking-wider">
                        VALERIA M. MORALES
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">VENCE</div>
                      <div className="font-mono text-xs text-slate-300 font-semibold">
                        11/29
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-black text-black text-[11px] shadow">
                      &R
                    </div>
                  </div>

                  {/* Widget flotante de Saldo y Rendimiento */}
                  <div className="mt-5 p-3.5 bg-black/60 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-slate-400">PATRIMONIO TOTAL DISPONIBLE</div>
                      <div className="text-base font-bold font-mono text-cyan-300">$ 14.285.000 COP</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400 font-mono">+1.5% mensual</div>
                      <div className="text-[10px] text-slate-400">Rendimiento Ahorros</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PORTAFOLIO INTEGRAL (3 PRODUCTOS OBLIGATORIOS) */}
      <section id="productos" className="py-20 bg-[#070c18] border-t border-b border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-cyan-400 font-mono">
                PORTAFOLIO INTEGRAL
              </span>
              <h2 className="text-3xl font-bold text-white mt-1 font-display">
                Ingeniería de capital adaptada a cada fase de tu liquidez.
              </h2>
            </div>
            <p className="text-slate-400 text-xs max-w-md mt-2 md:mt-0">
              Diseñado bajo arquitectura modular para potenciar el flujo de caja, maximizar rendimientos y blindar tus transacciones globales.
            </p>
          </div>

          {/* Grilla de las 3 Cuentas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 3.1 Cuenta de Ahorros */}
            <div id="cuentas" className="bg-[#0b1222] border border-amber-500/20 hover:border-amber-500/50 rounded-3xl p-6 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    1.5% Mensual
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Modalidad Ahorro</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Crecimiento predecible con capitalización mensual compuesta. Bóvedas de reserva aisladas para metas fiscales, contingencias y expansión.
                </p>

                <ul className="space-y-3 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Bóvedas multi-objetivo con candado temporal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Liquidación de rendimientos del 1.5% al momento del retiro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Sin penalidades de retiro en bóvedas líquidas</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Tasa E.A. eq:</div>
                  <div className="text-sm font-bold text-amber-300 font-mono">19.56%</div>
                </div>
                <button
                  onClick={onOpenRegister}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  Conocer más <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3.2 Cuenta Corriente */}
            <div className="bg-[#0b1222] border border-cyan-500/20 hover:border-cyan-500/50 rounded-3xl p-6 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Sobregiro +20%
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Modalidad Corriente</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Gestión de tesorería de alta rotación para nóminas, proveedores e inversiones. Margen de sobregiro operativo instantáneo sin burocracia.
                </p>

                <ul className="space-y-3 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Margen del 20% automático según saldo promedio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Transferencias interbancarias inmediatas sin costo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Múltiples subcuentas con tarjetas virtuales dinámicas</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Disponibilidad</div>
                  <div className="text-sm font-bold text-cyan-300 font-mono">99.99% SLA</div>
                </div>
                <button
                  onClick={onOpenRegister}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  Conocer más <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3.3 Tarjeta de Crédito */}
            <div id="tarjeta" className="bg-[#0b1222] border border-fuchsia-500/20 hover:border-fuchsia-500/50 rounded-3xl p-6 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    0% a 1 y 2 Cuotas
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Tarjeta de Crédito &rys Banco</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Financia tus compras a cuotas con tasas transparentes según la regulación financiera colombiana. Tasa 0% en diferidos a 1 o 2 cuotas.
                </p>

                <ul className="space-y-3 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>Tasa cero (0%) absoluta en compras a 1 o 2 cuotas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>Tasas diferenciadas de 3 a 36 meses (1.9% y 2.3% mensual)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>Fórmula matemática oficial de amortización de cuota mensual</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Cupos hasta</div>
                  <div className="text-sm font-bold text-fuchsia-300 font-mono">$ 35.000.000 COP</div>
                </div>
                <button
                  onClick={onOpenRegister}
                  className="text-xs font-semibold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 cursor-pointer"
                >
                  Conocer más <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIMULADOR FINANCIERO INTERACTIVO */}
      <section className="py-12">
        <FinancialSimulator onOpenAccount={onOpenRegister} />
      </section>

      {/* 4. BLINDAJE INSTITUCIONAL (fiel a screenDiseñoweb.png) */}
      <section id="seguridad" className="py-20 bg-[#070c18] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 mb-4">
            <Lock className="w-3.5 h-3.5" />
            BLINDAJE INSTITUCIONAL
          </div>
          <h2 className="text-3xl font-bold text-white font-display">
            Seguridad en cada capa de transacción
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2 mb-12">
            Tu patrimonio está resguardado por las tecnologías más rigurosas de la industria financiera mundial.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-[#0a1120] border border-slate-800/80 p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">Autenticación Biométrica</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acceso seguro con FaceID, TouchID y llaves físicas FIDO2 de tokenización por hardware con validación instantánea.
              </p>
            </div>

            <div className="bg-[#0a1120] border border-slate-800/80 p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">Monitoreo Preventivo</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Motores de inteligencia analítica que analizan patrones de gasto anómalos 24 horas al día para frustrar fraudes antes de que ocurran.
              </p>
            </div>

            <div className="bg-[#0a1120] border border-slate-800/80 p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <Snowflake className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">Congelamiento Rápido</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inhabilita o habilita tus tarjetas Obsidian físicas y digitales en 1 clic directamente desde tu panel de control, sin llamadas.
              </p>
            </div>

            <div className="bg-[#0a1120] border border-slate-800/80 p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">Atención Especializada</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acceso telefónico y chat cifrado prioritario con ejecutivos bancarios reales en menos de 45 segundos, los 365 días del año.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MÉTRICAS CLAVE (fiel a screenDiseñoweb.png) */}
      <section className="py-12 border-t border-b border-slate-900 bg-[#050912]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">VOLUMEN CUSTODIADO</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-1">$2.4B+</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Activos administrados en 2026</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">TIEMPO DE RESPUESTA</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">&lt; 38ms</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Latencia de red transaccional</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">USUARIOS PATRIMONIALES</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">185K</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Empresarios y nómadas globales</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">ÍNDICE DE SOLVENCIA</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">24.8%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">El doble del requerimiento legal</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ONBOARDING CTA BANNER (fiel a screenDiseñoweb.png) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800 bg-gradient-to-r from-[#0d1629] via-[#0b1222] to-[#070c18] shadow-2xl">
            {/* Barra arcoíris superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 via-purple-500 to-cyan-400" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-800/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  APERTURA EN 4 MINUTOS
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white font-display">
                  Toma el control <span className="text-cyan-400">absoluto</span> de tus <span className="text-amber-400">finanzas</span> hoy mismo.
                </h3>

                <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                  Abre tu cuenta digital en &rys Banco con tu documento oficial y tu dispositivo móvil. Sin costos de mantenimiento, sin filas y con tus productos financieros activados al instante.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    Abrir mi cuenta sin costo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Sin saldo mínimo requerido
                  </span>
                </div>
              </div>

              {/* Onboarding steps list */}
              <div className="lg:col-span-5 bg-[#050912]/80 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
                  <span className="font-mono text-slate-400 uppercase">PROCESO DE ONBOARDING</span>
                  <span className="text-cyan-400 font-bold">100% Digital</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold flex items-center justify-center shrink-0">1</span>
                    <span className="text-slate-300">Validación de identidad biométrica instantánea</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">2</span>
                    <span className="text-slate-300">Creación instantánea de credenciales y usuario</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">3</span>
                    <span className="text-slate-300">Emisión de tarjeta virtual Apple/Google Pay</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 flex justify-between">
                  <span>Respaldado por FOGAFIN</span>
                  <span>Cifrado TLS 1.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
