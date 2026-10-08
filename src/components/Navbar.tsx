/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Barra de Navegación Neobanco &rys Bank
 */

import React, { useState } from 'react';
import { Logo } from './Logo';
import { User, LogIn, UserPlus, Shield, Cpu, Menu, X, Users, Wallet, Code2 } from 'lucide-react';
import { Cliente } from '../models/Cliente';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  clienteActual: Cliente | null;
  onLogout: () => void;
  onOpenPooAudit: () => void;
  onOpenUmlModal: () => void;
  onQuickDemoLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  clienteActual,
  onLogout,
  onOpenPooAudit,
  onOpenUmlModal,
  onQuickDemoLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#050911]/90 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo corporativo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('landing')}
              className="text-left cursor-pointer focus:outline-none"
            >
              <Logo size="md" />
            </button>

            {/* Links de navegación desktop */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <button
                onClick={() => onNavigate('landing')}
                className={`hover:text-cyan-400 transition-colors cursor-pointer ${currentView === 'landing' ? 'text-cyan-400' : ''}`}
              >
                Inicio
              </button>
              <a href="#productos" className="hover:text-cyan-400 transition-colors cursor-pointer">
                Productos
              </a>
              <a href="#cuentas" className="hover:text-cyan-400 transition-colors cursor-pointer">
                Cuentas & Ahorro
              </a>
              <a href="#tarjeta" className="hover:text-cyan-400 transition-colors cursor-pointer">
                Tarjeta de Crédito
              </a>
              <a href="#simulador" className="hover:text-cyan-400 transition-colors cursor-pointer">
                Simulador
              </a>
              <a href="#seguridad" className="hover:text-cyan-400 transition-colors cursor-pointer">
                Seguridad
              </a>

              {/* Botón Diagrama UML & JS para VS Code */}
              <button
                type="button"
                onClick={onOpenUmlModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fuchsia-950/60 border border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-900/60 transition-all cursor-pointer font-mono text-[11px]"
              >
                <Code2 className="w-3.5 h-3.5 text-fuchsia-400" />
                Diagrama UML & JS
              </button>

              {/* Botón Auditoría POO */}
              <button
                type="button"
                onClick={onOpenPooAudit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition-all cursor-pointer font-mono text-[11px]"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Auditoría POO
              </button>
            </div>
          </div>

          {/* Acciones del lado derecho */}
          <div className="hidden sm:flex items-center gap-3">
            {clienteActual ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-800/80 text-white hover:bg-slate-700'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  Panel Cajero / Saldo
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('crud')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    currentView === 'crud'
                      ? 'bg-fuchsia-950/60 border-fuchsia-500 text-fuchsia-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                  title="Administración CRUD de Usuarios"
                >
                  <Users className="w-4 h-4 text-fuchsia-400" />
                  CRUD Usuarios
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('perfil')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0b1324] border border-slate-800 text-xs text-slate-200 hover:border-slate-700 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-black">
                    {clienteActual.nombreCompleto.charAt(0)}
                  </div>
                  <span className="font-semibold max-w-[100px] truncate">{clienteActual.nombreCompleto.split(' ')[0]}</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onQuickDemoLogin}
                  className="px-3 py-2 rounded-xl text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/40 transition-colors cursor-pointer"
                  title="Acceso instantáneo con la cuenta demo de David Morales"
                >
                  ⚡ Demo Rápido
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Iniciar Sesión
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Abrir Cuenta
                </button>
              </div>
            )}
          </div>

          {/* Botón hamburguesa móvil */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-slate-800 space-y-2 bg-[#050911]">
            <button
              onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              Inicio
            </button>
            <button
              onClick={() => { onOpenPooAudit(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-cyan-300 font-mono hover:bg-cyan-950/40"
            >
              Auditoría POO
            </button>
            <button
              onClick={() => { onOpenUmlModal(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-fuchsia-300 font-mono hover:bg-fuchsia-950/40"
            >
              Diagrama UML & JS (VS Code)
            </button>

            {clienteActual ? (
              <>
                <button
                  onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-cyan-400 bg-cyan-950/20"
                >
                  Mi Panel Bancario
                </button>
                <button
                  onClick={() => { onNavigate('crud'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-fuchsia-300 hover:bg-fuchsia-950/20"
                >
                  CRUD Usuarios
                </button>
                <button
                  onClick={() => { onNavigate('perfil'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
                >
                  Mi Perfil & Seguridad
                </button>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-950/20"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => { onQuickDemoLogin(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-mono text-cyan-300 bg-cyan-950/30"
                >
                  ⚡ Demo Rápido (David Morales)
                </button>
                <button
                  onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-cyan-400"
                >
                  Abrir Cuenta Nueva
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
