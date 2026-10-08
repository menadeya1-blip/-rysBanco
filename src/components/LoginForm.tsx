/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Módulo 4.1 Formulario de Inicio de Sesión
 * Cumple con validación, contador visible de 3 intentos y bloqueo preventivo
 */

import React, { useState } from 'react';
import { Logo } from './Logo';
import { Lock, User, AlertTriangle, ShieldCheck, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { Banco } from '../models/Banco';

interface LoginFormProps {
  banco: Banco;
  onLoginSuccess: () => void;
  onNavigateRegister: () => void;
  onQuickDemo: (username: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  banco,
  onLoginSuccess,
  onNavigateRegister,
  onQuickDemo,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [intentosRestantes, setIntentosRestantes] = useState<number>(3);
  const [estaBloqueada, setEstaBloqueada] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // Manejador del submit de login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setMensajeError("Por favor ingresa tu nombre de usuario y tu contraseña.");
      return;
    }

    setLoading(true);
    setMensajeError(null);

    setTimeout(() => {
      const res = banco.autenticar(username, password);
      setLoading(false);

      if (res.exito) {
        onLoginSuccess();
      } else {
        setMensajeError(res.mensaje);
        if (res.intentosRestantes !== undefined) {
          setIntentosRestantes(res.intentosRestantes);
        }
        if (res.bloqueado) {
          setEstaBloqueada(true);
          setIntentosRestantes(0);
        }
      }
    }, 300);
  };

  // Desbloqueo administrativo de emergencia para pruebas
  const handleDesbloquearPrueba = () => {
    const cliente = banco.obtenerClientePorUsername(username);
    if (cliente) {
      cliente.desbloquear();
      banco.guardarEnStorage();
      setEstaBloqueada(false);
      setIntentosRestantes(3);
      setMensajeError("Tu cuenta ha sido desbloqueada por el sistema de seguridad. Puedes volver a intentar.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0a101f]/95 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative">
        {/* Glow de acento */}
        <div className="absolute top-0 right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Iniciar Sesión
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Sucursal Virtual &rys Banco • Acceso Seguro
          </p>
        </div>

        {/* CONTADOR DE INTENTOS VISIBLE (Requisito 4.1) */}
        <div className={`mb-6 p-3 rounded-2xl border text-xs flex items-center justify-between ${
          estaBloqueada
            ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
            : intentosRestantes < 3
            ? 'bg-amber-950/40 border-amber-600/60 text-amber-200'
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <KeyRound className={`w-4 h-4 ${estaBloqueada ? 'text-rose-400' : intentosRestantes < 3 ? 'text-amber-400' : 'text-cyan-400'}`} />
            <span className="font-semibold">Seguridad de Acceso:</span>
          </div>
          <div className="font-mono text-xs font-bold">
            {estaBloqueada ? (
              <span className="text-rose-400">CUENTA BLOQUEADA</span>
            ) : (
              <span>Intentos restantes: <strong className="text-cyan-300">{intentosRestantes}/3</strong></span>
            )}
          </div>
        </div>

        {/* Mensaje de error o bloqueo */}
        {mensajeError && (
          <div className={`p-4 rounded-xl text-xs mb-6 flex items-start gap-3 border ${
            estaBloqueada
              ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          }`}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="leading-relaxed">{mensajeError}</p>
              {estaBloqueada && (
                <button
                  type="button"
                  onClick={handleDesbloquearPrueba}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/30 border border-rose-500 hover:bg-rose-600/50 text-white font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Desbloqueo Administrativo de Prueba
                </button>
              )}
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Nombre de Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="ej: david o valeria"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={estaBloqueada}
                className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={estaBloqueada}
                className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || estaBloqueada}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-40 cursor-pointer"
          >
            {loading ? 'Verificando credenciales...' : 'Ingresar a mi Banca'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Separador de Accesos Rápidos Demo para el Docente */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 text-center uppercase tracking-wider mb-3">
            ACCESO RÁPIDO EVALUACIÓN DOCENTE
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onQuickDemo('david')}
              className="p-2.5 rounded-xl bg-slate-900 border border-cyan-800/40 hover:border-cyan-400/60 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-cyan-300">David Morales</div>
              <div className="text-[10px] text-slate-400 font-mono">david / password123</div>
            </button>
            <button
              type="button"
              onClick={() => onQuickDemo('valeria')}
              className="p-2.5 rounded-xl bg-slate-900 border border-fuchsia-800/40 hover:border-fuchsia-400/60 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-fuchsia-300">Valeria Morales</div>
              <div className="text-[10px] text-slate-400 font-mono">valeria / password123</div>
            </button>
          </div>
        </div>

        {/* Enlace para registrarse */}
        <div className="mt-6 text-center text-xs text-slate-400">
          ¿Aún no tienes cuenta en &rys Banco?{' '}
          <button
            type="button"
            onClick={onNavigateRegister}
            className="text-cyan-400 font-bold hover:underline cursor-pointer"
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};
