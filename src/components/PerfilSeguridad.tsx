/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Módulo de Perfil y Seguridad (Requisito 4.3)
 * Edición de datos y cambio seguro de contraseña con validación
 */

import React, { useState } from 'react';
import { User, Shield, Lock, Phone, IdCard, Mail, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { Cliente } from '../models/Cliente';
import { Banco } from '../models/Banco';

interface PerfilSeguridadProps {
  cliente: Cliente;
  banco: Banco;
  onSuccess: (mensaje: string) => void;
}

export const PerfilSeguridad: React.FC<PerfilSeguridadProps> = ({
  cliente,
  banco,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad'>('perfil');

  // Estado del formulario de perfil
  const [nombreCompleto, setNombreCompleto] = useState(cliente.nombreCompleto);
  const [celular, setCelular] = useState(cliente.celular);
  const [identificacion, setIdentificacion] = useState(cliente.identificacion);
  const [email, setEmail] = useState(cliente.email);
  const [perfilFeedback, setPerfilFeedback] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null);

  // Estado del formulario de cambio de clave
  const [claveActual, setClaveActual] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmacionClave, setConfirmacionClave] = useState('');
  const [claveFeedback, setClaveFeedback] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null);

  // Guardar datos de perfil
  const handleGuardarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    setPerfilFeedback(null);

    const res = cliente.actualizarPerfil({
      nombreCompleto,
      celular,
      identificacion,
      email,
    });

    banco.guardarEnStorage();
    if (res.exito) {
      setPerfilFeedback({ tipo: 'exito', mensaje: res.mensaje });
      onSuccess(res.mensaje);
    } else {
      setPerfilFeedback({ tipo: 'error', mensaje: res.mensaje });
    }
  };

  // Guardar cambio de contraseña
  const handleCambiarPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setClaveFeedback(null);

    if (!claveActual || !nuevaClave || !confirmacionClave) {
      setClaveFeedback({ tipo: 'error', mensaje: "Completa todos los campos para cambiar tu contraseña." });
      return;
    }

    const res = cliente.cambiarPassword(claveActual, nuevaClave, confirmacionClave);
    banco.guardarEnStorage();

    if (res.exito) {
      setClaveFeedback({ tipo: 'exito', mensaje: res.mensaje });
      setClaveActual('');
      setNuevaClave('');
      setConfirmacionClave('');
      onSuccess(res.mensaje);
    } else {
      setClaveFeedback({ tipo: 'error', mensaje: res.mensaje });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white font-display">Perfil & Seguridad</h2>
        <p className="text-xs text-slate-400 mt-1">
          Gestiona tus datos personales y credenciales de acceso a la banca digital &rys
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-[#070c18] border border-slate-800 rounded-2xl w-fit mb-6">
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'perfil'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Datos del Perfil
        </button>
        <button
          onClick={() => setActiveTab('seguridad')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'seguridad'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          Cambio de Contraseña
        </button>
      </div>

      {activeTab === 'perfil' ? (
        <div className="bg-[#0a101f] border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          {perfilFeedback && (
            <div className={`p-4 rounded-xl text-xs mb-6 flex items-start gap-3 border ${
              perfilFeedback.tipo === 'exito'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              {perfilFeedback.tipo === 'exito' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{perfilFeedback.mensaje}</span>
            </div>
          )}

          <form onSubmit={handleGuardarPerfil} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Documento de Identidad
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identificacion}
                    onChange={(e) => setIdentificacion(e.target.value)}
                    className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <IdCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Teléfono Celular
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* Datos fijos de usuario */}
            <div className="p-4 bg-[#060c18] border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Usuario en el Sistema: </span>
                <span className="font-mono text-cyan-300 font-bold">@{cliente.username}</span>
              </div>
              <div>
                <span className="text-slate-400">Nivel de Cliente: </span>
                <span className="font-semibold text-white">{cliente.tier}</span>
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl font-bold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios de Perfil
            </button>
          </form>
        </div>
      ) : (
        /* CAMBIO DE CONTRASEÑA (Requisito 4.3 y 5.5) */
        <div className="bg-[#0a101f] border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          {claveFeedback && (
            <div className={`p-4 rounded-xl text-xs mb-6 flex items-start gap-3 border ${
              claveFeedback.tipo === 'exito'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              {claveFeedback.tipo === 'exito' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{claveFeedback.mensaje}</span>
            </div>
          )}

          <div className="mb-4 text-xs text-slate-400">
            Proceso de seguridad para el usuario: <strong className="text-white font-mono">{cliente.username}</strong>
          </div>

          <form onSubmit={handleCambiarPassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Contraseña Actual *
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Ingresa tu clave actual"
                  value={claveActual}
                  onChange={(e) => setClaveActual(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Nueva Contraseña *
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={nuevaClave}
                  onChange={(e) => setNuevaClave(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Confirmar Nueva Contraseña *
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Repite la nueva clave"
                  value={confirmacionClave}
                  onChange={(e) => setConfirmacionClave(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Lock className="w-4 h-4" />
              Actualizar Contraseña
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
