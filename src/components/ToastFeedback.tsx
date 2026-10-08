/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Toast de Retroalimentación de Operaciones
 */

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface ToastMessage {
  id: string;
  tipo: 'exito' | 'error' | 'advertencia' | 'info';
  texto: string;
}

interface ToastFeedbackProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastFeedback: React.FC<ToastFeedbackProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    const ultimo = toasts[toasts.length - 1];
    if (ultimo && ultimo.tipo === 'exito') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#06b6d4', '#10b981', '#f43f5e', '#fbbf24'],
        });
      } catch (e) {
        // Ignorar si no está disponible canvas
      }
    }
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 ${
            t.tipo === 'exito'
              ? 'bg-[#08181d]/95 border-emerald-500/50 text-emerald-200'
              : t.tipo === 'error'
              ? 'bg-[#1e0a12]/95 border-rose-500/50 text-rose-200'
              : 'bg-[#1a1508]/95 border-amber-500/50 text-amber-200'
          }`}
        >
          {t.tipo === 'exito' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {t.tipo === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {t.tipo === 'advertencia' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {t.tipo === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}

          <div className="flex-1 text-xs leading-relaxed">
            <span className="font-bold block mb-0.5">
              {t.tipo === 'exito' ? 'Operación Exitosa' : t.tipo === 'error' ? 'Operación Denegada' : 'Aviso del Sistema'}
            </span>
            <span>{t.texto}</span>
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
