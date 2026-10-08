/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Módulo 4.1 Administración de Usuarios (CRUD)
 * Interfaz para Agregar, Editar y Eliminar usuarios (con confirmación)
 */

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Check, 
  ExternalLink,
  Wallet
} from 'lucide-react';
import { Cliente } from '../models/Cliente';
import { Banco } from '../models/Banco';

interface AdminUsuariosCRUDProps {
  banco: Banco;
  clienteActual: Cliente | null;
  onSelectCliente: (cliente: Cliente) => void;
  onRefresh: () => void;
  onSuccess: (mensaje: string) => void;
}

export const AdminUsuariosCRUD: React.FC<AdminUsuariosCRUDProps> = ({
  banco,
  clienteActual,
  onSelectCliente,
  onRefresh,
  onSuccess,
}) => {
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);
  const [clienteAEliminar, setClienteAEliminar] = useState<Cliente | null>(null);

  // Formulario Crear
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoUsername, setNuevoUsername] = useState('');
  const [nuevoDoc, setNuevoDoc] = useState('');
  const [nuevoTel, setNuevoTel] = useState('');
  const [nuevoPass, setNuevoPass] = useState('');
  const [errorCrear, setErrorCrear] = useState<string | null>(null);

  // Formulario Editar
  const [editNombre, setEditNombre] = useState('');
  const [editTel, setEditTel] = useState('');
  const [editDoc, setEditDoc] = useState('');
  const [editDesbloquear, setEditDesbloquear] = useState(false);

  const todosClientes = banco.obtenerTodosLosClientes();

  // Abrir modal de edición
  const abrirEdicion = (c: Cliente) => {
    setClienteAEditar(c);
    setEditNombre(c.nombreCompleto);
    setEditTel(c.celular);
    setEditDoc(c.identificacion);
    setEditDesbloquear(c.bloqueado);
  };

  // Guardar edición
  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteAEditar) return;

    const res = banco.actualizarClienteAdmin(clienteAEditar.id, {
      nombreCompleto: editNombre,
      celular: editTel,
      identificacion: editDoc,
      desbloquear: editDesbloquear,
    });

    if (res.exito) {
      onSuccess(res.mensaje);
      setClienteAEditar(null);
      onRefresh();
    }
  };

  // Crear usuario
  const handleCrearUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCrear(null);

    const res = banco.registrarCliente({
      nombreCompleto: nuevoNombre,
      username: nuevoUsername,
      identificacion: nuevoDoc,
      celular: nuevoTel,
      password: nuevoPass,
      confirmacionPassword: nuevoPass,
      saldoInicialAhorros: 2000,
      saldoInicialCorriente: 1000,
      cupoTarjetaCredito: 6000,
    });

    if (res.exito) {
      onSuccess(res.mensaje);
      setModalCrearAbierto(false);
      setNuevoNombre('');
      setNuevoUsername('');
      setNuevoDoc('');
      setNuevoTel('');
      setNuevoPass('');
      onRefresh();
    } else {
      setErrorCrear(res.mensaje);
    }
  };

  // Eliminar usuario con confirmación
  const handleConfirmarEliminar = () => {
    if (!clienteAEliminar) return;

    const res = banco.eliminarCliente(clienteAEliminar.id);
    if (res.exito) {
      onSuccess(res.mensaje);
      setClienteAEliminar(null);
      onRefresh();
    } else {
      alert(res.mensaje);
      setClienteAEliminar(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono text-cyan-400">
              MÓDULO DE GESTIÓN (CRUD)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              {todosClientes.length} Usuarios Registrados
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
            Administración de Usuarios y Cuentas
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Crea, edita, desbloquea y administra clientes de &rys Banco
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalCrearAbierto(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-[#0a101f] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#060a14] border-b border-slate-800 text-[11px] uppercase tracking-wider font-mono text-slate-400">
              <tr>
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Identificación</th>
                <th className="py-4 px-6">Productos & Cuentas</th>
                <th className="py-4 px-6">Patrimonio Líquido</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {todosClientes.map((c) => {
                const esActivo = clienteActual?.id === c.id;
                return (
                  <tr key={c.id} className={`hover:bg-slate-900/40 transition-colors ${esActivo ? 'bg-cyan-950/20' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center font-bold text-black text-xs">
                          {c.nombreCompleto.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {c.nombreCompleto}
                            {esActivo && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-cyan-400 text-black font-bold">
                                Sesión Activa
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            @{c.username} • {c.celular}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-slate-300">
                      {c.identificacion}
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-0.5 text-[11px]">
                        {c.cuentas.map(cta => (
                          <div key={cta.numeroCuenta} className="font-mono text-slate-400">
                            <span className="text-cyan-400 font-semibold">{cta.numeroCuenta.split('-')[0]}:</span> {cta.numeroCuenta} (${cta.saldo.toLocaleString('es-CO')})
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-white text-sm">
                      ${c.patrimonioLiquidoTotal.toLocaleString('es-CO')} COP
                    </td>

                    <td className="py-4 px-6">
                      {c.bloqueado ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                          <Lock className="w-3 h-3" /> Bloqueado (3 fallos)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <Check className="w-3 h-3 text-emerald-400" /> Activo
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      {!esActivo && (
                        <button
                          type="button"
                          onClick={() => onSelectCliente(c)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300 hover:bg-cyan-900/60 font-semibold text-[11px] cursor-pointer"
                          title="Cambiar sesión activa a este usuario"
                        >
                          Usar
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => abrirEdicion(c)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer inline-block"
                        title="Editar usuario"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {!esActivo && (
                        <button
                          type="button"
                          onClick={() => setClienteAEliminar(c)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-900/50 cursor-pointer inline-block"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR USUARIO */}
      {modalCrearAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0a101f] border border-cyan-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Registrar Nuevo Usuario</h3>
              <button onClick={() => setModalCrearAbierto(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearUsuario} className="p-6 space-y-4">
              {errorCrear && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-200">
                  {errorCrear}
                </div>
              )}

              <div>
                <label className="text-xs text-slate-300 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Username Único *</label>
                <input
                  type="text"
                  required
                  value={nuevoUsername}
                  onChange={(e) => setNuevoUsername(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Identificación (Cédula) *</label>
                <input
                  type="text"
                  required
                  value={nuevoDoc}
                  onChange={(e) => setNuevoDoc(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Celular *</label>
                <input
                  type="text"
                  required
                  value={nuevoTel}
                  onChange={(e) => setNuevoTel(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Contraseña *</label>
                <input
                  type="password"
                  required
                  value={nuevoPass}
                  onChange={(e) => setNuevoPass(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalCrearAbierto(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Crear Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR USUARIO */}
      {clienteAEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0a101f] border border-cyan-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Editar Cliente: @{clienteAEditar.username}</h3>
              <button onClick={() => setClienteAEditar(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarEdicion} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Identificación</label>
                <input
                  type="text"
                  value={editDoc}
                  onChange={(e) => setEditDoc(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Celular</label>
                <input
                  type="text"
                  value={editTel}
                  onChange={(e) => setEditTel(e.target.value)}
                  className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {clienteAEditar.bloqueado && (
                <div className="p-3 bg-amber-950/30 border border-amber-600/40 rounded-xl flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="desbloquearCheck"
                    checked={editDesbloquear}
                    onChange={(e) => setEditDesbloquear(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400"
                  />
                  <label htmlFor="desbloquearCheck" className="text-xs text-amber-200">
                    Desbloquear cuenta (Restablecer intentos fallidos a 0)
                  </label>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setClienteAEditar(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN OBLIGATORIA PARA ELIMINAR (Requisito 4.1) */}
      {clienteAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#140a0f] border border-rose-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">¿Confirmar Eliminación de Usuario?</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Estás a punto de eliminar permanentemente al cliente <strong>{clienteAEliminar.nombreCompleto}</strong> (@{clienteAEliminar.username}) y sus productos vinculados. Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setClienteAEliminar(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarEliminar}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-rose-600/30"
              >
                Sí, Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
