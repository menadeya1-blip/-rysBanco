/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Footer Institucional &rys Bank
 * Réplica fiel al pie de página en screenDiseñoweb.png
 */

import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Lock, Award, Globe, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenSimulator?: () => void;
  onOpenAudit?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSimulator, onOpenAudit }) => {
  return (
    <footer className="w-full bg-[#03060c] border-t border-slate-900/90 text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner de Protección FOGAFIN y Certificaciones */}
        <div className="bg-[#070c18] border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-14 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-white font-bold text-sm flex items-center gap-2">
                Protección de Fondos FOGAFIN
              </div>
              <div className="text-slate-400 text-xs mt-0.5">
                Los depósitos en &rys Banco están asegurados por el seguro de depósitos FOGAFIN hasta el monto máximo de ley.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-[#0b1324] border border-slate-800 font-mono text-[11px] text-cyan-300 font-semibold flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-cyan-400" />
              ISO/IEC 27001
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[#0b1324] border border-slate-800 font-mono text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
              <Award className="w-3 h-3 text-emerald-400" />
              PCI-DSS Nivel 1
            </span>
          </div>
        </div>

        {/* Columnas del Footer */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Columna Marca */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Institución bancaria digital de última generación. Arquitectura fiscal robusta con custodia patrimonial blindada y tecnología financiera de alto rendimiento.
            </p>
            <div className="pt-2 flex items-center gap-2 text-slate-500 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistemas transaccionales operativos 99.99% SLA</span>
            </div>
          </div>

          {/* Columna Soluciones */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
              SOLUCIONES
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#cuentas" className="hover:text-cyan-400 transition-colors">Cuentas de Alto Rendimiento</a>
              </li>
              <li>
                <a href="#tarjeta" className="hover:text-cyan-400 transition-colors">Tarjeta de Crédito</a>
              </li>
              <li>
                <span className="text-slate-500">Bóvedas Multi-divisa</span>
              </li>
              <li>
                <button onClick={onOpenSimulator} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                  Simulador de Rendimientos
                </button>
              </li>
              <li>
                <span className="text-slate-500">Líneas Patrimoniales</span>
              </li>
            </ul>
          </div>

          {/* Columna Transparencia */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
              TRANSPARENCIA
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Tasas y Tarifas Vigentes</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Defensor del Consumidor</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Red de Cajeros Global</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Protocolos de Seguridad</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Términos y Condiciones</span>
              </li>
            </ul>
          </div>

          {/* Columna Corporativo & POO */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-mono">
              CORPORATIVO
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Sobre &rys Banco</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Gobernanza Corporativa</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Sala de Prensa</span>
              </li>
              <li>
                <button onClick={onOpenAudit} className="text-cyan-400 hover:underline font-mono text-[11px] cursor-pointer">
                  Auditoría POO Académica
                </button>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Centro de Privacidad</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra legal final */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 &rys Banco S.A. Entidad Bancaria Vigilada por la Superintendencia Financiera de Colombia. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacidad</span>
            <span className="hover:text-slate-300 cursor-pointer">Cookies</span>
            <span className="hover:text-slate-300 cursor-pointer">Atención al Usuario</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
