import React from 'react';
import { AvailabilityBadge } from '../types';

interface BadgeProps {
  type: AvailabilityBadge | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, className = '', size = 'md' }) => {
  let colorStyles = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  switch (type) {
    case 'REAL TEST':
    case 'REAL MEASUREMENT':
      colorStyles = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950';
      dotColor = 'bg-emerald-400 animate-pulse';
      break;
    case 'LOCAL CALCULATION':
      colorStyles = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-950';
      dotColor = 'bg-cyan-400';
      break;
    case 'REFERENCE':
      colorStyles = 'bg-purple-950/60 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-950';
      dotColor = 'bg-purple-400';
      break;
    case 'LAB / SIMULATION':
    case 'DEMO / SIMULATION':
      colorStyles = 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950';
      dotColor = 'bg-amber-400';
      break;
    case 'COURS / LEÇON':
    case 'MODULE PÉDAGOGIQUE':
    case 'LEÇON':
    case 'COURS':
      colorStyles = 'bg-indigo-950/70 text-indigo-300 border-indigo-500/50 shadow-sm shadow-indigo-950';
      dotColor = 'bg-indigo-400 animate-pulse';
      break;
    case 'MANUAL INPUT':
      colorStyles = 'bg-blue-950/60 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-950';
      dotColor = 'bg-blue-400';
      break;
    case 'BACKEND REQUIRED':
      colorStyles = 'bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950';
      dotColor = 'bg-rose-400';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium tracking-wider uppercase rounded-full border ${colorStyles} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {type}
    </span>
  );
};
