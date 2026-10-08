/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Componente Logo &rys Banking
 * Diseñado fiel al logotipo corporativo screenlogo.png
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { symbol: 'h-6 w-6', text: 'text-lg', sub: 'text-[9px]' },
    md: { symbol: 'h-8 w-8', text: 'text-2xl', sub: 'text-[10px]' },
    lg: { symbol: 'h-11 w-11', text: 'text-3xl', sub: 'text-xs' },
    xl: { symbol: 'h-14 w-14', text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icono del monograma & estilizado con degradado sunset-cyan */}
      <div className={`relative ${currentSize.symbol} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_12px_rgba(20,184,166,0.35)]">
          <defs>
            <linearGradient id="rysGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="35%" stopColor="#f43f5e" />
              <stop offset="70%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="dotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          {/* Forma fluida del ampersand & */}
          <path
            d="M58 24C58 17.37 52.63 12 46 12C39.37 12 34 17.37 34 24C34 33 46 42 46 52C46 63 37 72 26 72C15 72 8 63 8 52C8 38 20 28 32 28"
            stroke="url(#rysGradient)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 72L74 28"
            stroke="url(#rysGradient)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M48 50L76 80"
            stroke="url(#rysGradient)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Pequeño punto holográfico distintivo */}
          <circle cx="78" cy="22" r="5" fill="url(#dotGrad)" />
        </svg>
      </div>

      {/* Tipografía de la marca */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`font-black tracking-tight text-white ${currentSize.text} font-display`}>
            &rys
          </span>
          <span className="text-cyan-400 font-bold text-xs tracking-wider">
            BANCO
          </span>
        </div>

        {/* Línea sutil característica */}
        <div className="h-[2px] w-full mt-0.5 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 via-purple-500 to-cyan-400" />

        {showSubtitle && (
          <div className="flex items-center justify-between mt-0.5">
            <span className={`font-mono uppercase tracking-[0.25em] text-slate-400 font-semibold ${currentSize.sub}`}>
              COLOMBIA
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
