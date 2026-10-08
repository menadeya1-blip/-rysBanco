/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal Transferencias (Módulo 4.3)
 * Transferencias internas entre productos y hacia cuentas de otros usuarios
 * Restricción: No se permiten transferencias al mismo producto
 */

import React, { useState } from 'react';
import { X, ArrowRightLeft, AlertCircle, CheckCircle2, User, Search, ShieldCheck } from 'lucide-react';
import { Cliente } from '../models/Cliente';
import { Banco } from '../models/Banco';

interface ModalTransferirProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente;
  banco: Banco;
  onSuccess: (mensaje: string) => void;
}

export const ModalTransferir: React.FC<ModalTransferirProps> = ({
  isOpen,
  onClose,
  cliente,
  banco,
  onSuccess,
}) => {
  const [tipoDestino, setTipoDestino] = useState<'interna' | 'interbancaria'>('interna');

  // Transferencia interna
  const [cuentaOrigen, setCuentaOrigen] = useState<string>(cliente.cuentas[0]?.numeroCuenta || '');
  const [cuentaDestinoInterna, setCuentaDestinoInterna] = useState<string>(
    cliente.cuentas[1]?.numeroCuenta || ''
  );

  // Transferencia a otros usuarios
  const [cuentaDestinoTercero, setCuentaDestinoTercero] = useState<string>('');
  const [busquedaUsuario, setBusquedaUsuario] = useState<string>('');
  const [destinatarioVerificado, setDestinatarioVerificado] = useState<any>(null);

  const [monto, setMonto] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('Transferencia inmediata &rys Banco');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const cuentaOrigenObj = cliente.obtenerCuenta(cuentaOrigen) || cliente.cuentas[0];
  const montoNum = Number(monto) || 0;

  // Contactos rápidos sugeridos registrados en el sistema
  const otrosClientes = banco.obtenerTodosLosClientes().filter(c => c.id !== cliente.id);

  const seleccionarContacto = (contacto: Cliente) => {
    const cuentaPrincipal = contacto.cuentas[0];
    if (cuentaPrincipal) {
      setCuentaDestinoTercero(cuentaPrincipal.numeroCuenta);
      setDestinatarioVerificado({
        titular: contacto.nombreCompleto,
        username: contacto.username,
        cuenta: cuentaPrincipal.numeroCuenta,
        tipo: cuentaPrincipal.obtenerNombreComercial(),
      });
      setError(null);
    }
  };

  const handleVerificarCuenta = () => {
    setError(null);
    if (!cuentaDestinoTercero.trim()) {
      setError("Ingresa el número de cuenta de destino.");
      return;
    }

    const hallado = banco.buscarCuentaGlobal(cuentaDestinoTercero);
    if (hallado) {
      setDestinatarioVerificado({
        titular: hallado.titular.nombreCompleto,
        username: hallado.titular.username,
        cuenta: hallado.cuenta.numeroCuenta,
        tipo: hallado.cuenta.obtenerNombreComercial(),
      });
    } else {
      setDestinatarioVerificado(null);
      setError(`No existe ninguna cuenta registrada con el número ${cuentaDestinoTercero}.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError("El monto a transferir debe ser un número positivo mayor a cero.");
      return;
    }

    if (!cuentaOrigenObj) {
      setError("Debes seleccionar una cuenta de origen válida.");
      return;
    }

    if (tipoDestino === 'interna') {
      // RESTRICCIÓN OBLIGATORIA: No se permiten transferencias al mismo producto
      if (cuentaOrigen === cuentaDestinoInterna) {
        setError("Restricción bancaria: No se permiten transferencias al mismo producto de origen y destino.");
        return;
      }

      const res = cliente.transferirEntreProductos(cuentaOrigen, cuentaDestinoInterna, montoNum, descripcion);
      if (res.exito) {
        banco.guardarEnStorage();
        onSuccess(res.mensaje);
        onClose();
      } else {
        setError(res.mensaje);
      }
    } else {
      // Transferencia a otro usuario
      if (!cuentaDestinoTercero.trim()) {
        setError("Por favor ingresa o verifica la cuenta del destinatario.");
        return;
      }

      if (cuentaOrigen.toUpperCase() === cuentaDestinoTercero.trim().toUpperCase()) {
        setError("Restricción bancaria: No puedes transferir a tu misma cuenta.");
        return;
      }

      const res = banco.transferirAOtroCliente(cliente, cuentaOrigen, cuentaDestinoTercero.trim(), montoNum, descripcion);
      if (res.exito) {
        onSuccess(res.mensaje);
        onClose();
      } else {
        setError(res.mensaje);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0a101f] border border-cyan-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Transferir Fondos</h3>
              <p className="text-xs text-slate-400">Entre tus productos o a usuarios de la red &rys Banco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Tipo de Transferencia */}
        <div className="flex border-b border-slate-800 bg-[#070c18] p-1.5">
          <button
            type="button"
            onClick={() => { setTipoDestino('interna'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tipoDestino === 'interna'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Entre mis productos
          </button>
          <button
            type="button"
            onClick={() => { setTipoDestino('interbancaria'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tipoDestino === 'interbancaria'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            A otros usuarios
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Cuenta Origen */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Cuenta de Origen
            </label>
            <select
              value={cuentaOrigen}
              onChange={(e) => setCuentaOrigen(e.target.value)}
              className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            >
              {cliente.cuentas.filter(c => c.obtenerTipo() !== 'TARJETA_CREDITO').map((c) => (
                <option key={c.numeroCuenta} value={c.numeroCuenta}>
                  {c.obtenerNombreComercial()} ({c.numeroCuenta}) - Saldo: ${c.saldo.toLocaleString('es-CO')} COP
                </option>
              ))}
            </select>
          </div>

          {/* Destino Interno */}
          {tipoDestino === 'interna' ? (
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Cuenta Destino (Mis Productos)
              </label>
              <select
                value={cuentaDestinoInterna}
                onChange={(e) => setCuentaDestinoInterna(e.target.value)}
                className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              >
                {cliente.cuentas.map((c) => (
                  <option 
                    key={c.numeroCuenta} 
                    value={c.numeroCuenta}
                    disabled={c.numeroCuenta === cuentaOrigen}
                  >
                    {c.obtenerNombreComercial()} ({c.numeroCuenta}) {c.numeroCuenta === cuentaOrigen ? '(Mismo producto - No permitido)' : ''}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 block mt-1">
                Restricción aplicada: No se permite transferir a la misma cuenta de origen.
              </span>
            </div>
          ) : (
            /* Destino Externo (Otro Usuario) */
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Número de Cuenta Destino
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ej: AHO-9941-12 o COR-4419-58"
                    value={cuentaDestinoTercero}
                    onChange={(e) => {
                      setCuentaDestinoTercero(e.target.value);
                      setDestinatarioVerificado(null);
                    }}
                    className="flex-1 bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleVerificarCuenta}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 rounded-xl cursor-pointer"
                  >
                    Verificar
                  </button>
                </div>
              </div>

              {/* Contactos rápidos registrados en el sistema */}
              {otrosClientes.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400 mb-1.5">
                    USUARIOS REGISTRADOS EN LA SUCURSAL:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {otrosClientes.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => seleccionarContacto(c)}
                        className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-lg text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <User className="w-3 h-3 text-cyan-400" />
                        <span>{c.nombreCompleto}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tarjeta de verificación de titular */}
              {destinatarioVerificado && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">{destinatarioVerificado.titular}</div>
                    <div className="text-[11px] text-emerald-300/80">
                      {destinatarioVerificado.tipo} • Cuenta: {destinatarioVerificado.cuenta}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Monto */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Monto a Transferir (COP) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-cyan-400 font-bold">$</span>
              <input
                type="number"
                step="any"
                min="1000"
                placeholder="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-3 pl-8 text-base text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Concepto */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Concepto
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Enviar Transferencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
