/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Módulo 4.1 Formulario de Registro de Nuevos Clientes
 * Coherente visualmente con la identidad corporativa &rys Bank
 */

import React, { useState } from 'react';
import { Logo } from './Logo';
import { User, Lock, CreditCard, Phone, IdCard, CheckCircle2, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { Banco } from '../models/Banco';

interface RegisterFormProps {
  banco: Banco;
  onRegisterSuccess: () => void;
  onNavigateLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  banco,
  onRegisterSuccess,
  onNavigateLogin,
}) => {
  const [identificacion, setIdentificacion] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [celular, setCelular] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacionPassword, setConfirmacionPassword] = useState('');
  const [saldoInicialAhorros, setSaldoInicialAhorros] = useState<number>(1500);
  const [saldoInicialCorriente, setSaldoInicialCorriente] = useState<number>(500);
  const [cupoTarjeta, setCupoTarjeta] = useState<number>(5000);

  const [error, setError] = useState<string | null>(null);
  const [exitoMensaje, setExitoMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identificacion.trim() || !nombreCompleto.trim() || !celular.trim() || !username.trim() || !password) {
      setError("Por favor completa todos los campos requeridos del formulario.");
      return;
    }

    if (password !== confirmacionPassword) {
      setError("La contraseña y su confirmación no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres por seguridad.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = banco.registrarCliente({
        identificacion,
        nombreCompleto,
        celular,
        username,
        password,
        confirmacionPassword,
        saldoInicialAhorros: Number(saldoInicialAhorros) || 0,
        saldoInicialCorriente: Number(saldoInicialCorriente) || 0,
        cupoTarjetaCredito: Number(cupoTarjeta) || 5000,
      });

      setLoading(false);

      if (res.exito && res.cliente) {
        setExitoMensaje(res.mensaje);
        // Autenticamos automáticamente al recién registrado
        banco.autenticar(username, password);
        setTimeout(() => {
          onRegisterSuccess();
        }, 1200);
      } else {
        setError(res.mensaje);
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-[#0a101f]/95 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative">
        <div className="absolute top-0 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Apertura de Cuenta Digital
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Únete a la plataforma bancaria &rys Banco
          </p>
        </div>

        {/* Mensajes de retroalimentación */}
        {error && (
          <div className="p-4 rounded-xl text-xs mb-6 flex items-start gap-3 bg-rose-950/40 border border-rose-500/40 text-rose-200">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {exitoMensaje && (
          <div className="p-4 rounded-xl text-xs mb-6 flex items-start gap-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-200">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
            <p className="leading-relaxed font-semibold">{exitoMensaje}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Documento de Identificación */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Cédula o Pasaporte *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ej: 1098765432"
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <IdCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Nombre Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ej: Alejandro Vega"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Celular */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Número de Celular *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="ej: +57 300 123 4567"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Nombre de Usuario */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Nombre de Usuario (Único) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ej: alejo_vega"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contraseña */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Confirmación */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Repite la contraseña"
                  value={confirmacionPassword}
                  onChange={(e) => setConfirmacionPassword(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          {/* Paquete Inicial de Productos Aperturados */}
          <div className="p-4 bg-[#060c18] border border-slate-800 rounded-2xl space-y-3">
            <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Productos Aperturados Automáticamente (POO Hierarchy)
            </div>
            <p className="text-[11px] text-slate-400">
              Se crearán tus 3 productos bancarios inmediatamente vinculados a tu titularidad:
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-amber-900/40">
                <div className="font-semibold text-amber-300 text-[11px]">1. Ahorros (1.5%)</div>
                <div className="text-[10px] text-slate-400 mt-1">Saldo inicial:</div>
                <input
                  type="number"
                  value={saldoInicialAhorros}
                  onChange={(e) => setSaldoInicialAhorros(Number(e.target.value))}
                  className="w-full mt-1 bg-black/60 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs"
                />
              </div>

              <div className="p-2.5 bg-slate-900 rounded-xl border border-cyan-900/40">
                <div className="font-semibold text-cyan-300 text-[11px]">2. Corriente (+20%)</div>
                <div className="text-[10px] text-slate-400 mt-1">Saldo inicial:</div>
                <input
                  type="number"
                  value={saldoInicialCorriente}
                  onChange={(e) => setSaldoInicialCorriente(Number(e.target.value))}
                  className="w-full mt-1 bg-black/60 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs"
                />
              </div>

              <div className="p-2.5 bg-slate-900 rounded-xl border border-fuchsia-900/40">
                <div className="font-semibold text-fuchsia-300 text-[11px]">3. Tarjeta Obsidian</div>
                <div className="text-[10px] text-slate-400 mt-1">Cupo crédito:</div>
                <input
                  type="number"
                  value={cupoTarjeta}
                  onChange={(e) => setCupoTarjeta(Number(e.target.value))}
                  className="w-full mt-1 bg-black/60 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-40 cursor-pointer"
          >
            {loading ? 'Creando tu cuenta y productos...' : 'Abrir mi Cuenta &rys Banco'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Enlace para volver a Login */}
        <div className="mt-6 text-center text-xs text-slate-400">
          ¿Ya tienes cuenta activa?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-cyan-400 font-bold hover:underline cursor-pointer"
          >
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
};
