import React from 'react';
import { 
  Phone, 
  Delete, 
  Video, 
  RotateCcw, 
  Hash, 
  UserPlus, 
  Volume2,
  Mic
} from 'lucide-react';
import { playDtmfTone } from '../../lib/sipAudio';

interface SipDialpadProps {
  dialNumber: string;
  onNumberChange: (val: string) => void;
  onStartCall: (isVideo?: boolean) => void;
  disabled?: boolean;
}

const DIALPAD_KEYS = [
  { char: '1', letters: ' ' },
  { char: '2', letters: 'A B C' },
  { char: '3', letters: 'D E F' },
  { char: '4', letters: 'G H I' },
  { char: '5', letters: 'J K L' },
  { char: '6', letters: 'M N O' },
  { char: '7', letters: 'P Q R S' },
  { char: '8', letters: 'T U V' },
  { char: '9', letters: 'W X Y Z' },
  { char: '*', letters: '' },
  { char: '0', letters: '+' },
  { char: '#', letters: '' },
];

export const SipDialpad: React.FC<SipDialpadProps> = ({
  dialNumber,
  onNumberChange,
  onStartCall,
  disabled = false
}) => {
  const handleKeyPress = (char: string) => {
    playDtmfTone(char);
    onNumberChange(dialNumber + char);
  };

  const handleBackspace = () => {
    if (dialNumber.length > 0) {
      onNumberChange(dialNumber.slice(0, -1));
    }
  };

  const handleClear = () => {
    onNumberChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && dialNumber.trim()) {
      onStartCall(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto w-full space-y-4">
      {/* Phone Number Display Screen */}
      <div className="w-full bg-[#070710] border-2 border-purple-500/40 rounded-2xl p-4 shadow-inner relative flex flex-col justify-center min-h-[84px]">
        <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIGNE SIP DISPONIBLE
          </span>
          {dialNumber && (
            <button 
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-300 text-[10px] uppercase font-mono"
            >
              Effacer
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            value={dialNumber}
            onChange={(e) => onNumberChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Numéro ou SIP URI..."
            disabled={disabled}
            className="bg-transparent text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider outline-none w-full placeholder:text-slate-600 truncate"
          />

          {dialNumber && (
            <button
              onClick={handleBackspace}
              disabled={disabled}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 shrink-0"
              title="Effacer le dernier caractère"
            >
              <Delete className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 3x4 Tactical Dialpad Keys */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {DIALPAD_KEYS.map((k) => (
          <button
            key={k.char}
            onClick={() => handleKeyPress(k.char)}
            disabled={disabled}
            className="flex flex-col items-center justify-center h-16 rounded-2xl bg-slate-900/90 hover:bg-purple-900/40 border border-slate-800/80 hover:border-purple-500/60 text-white transition-all duration-150 active:scale-95 shadow-md group disabled:opacity-50"
          >
            <span className="text-2xl font-mono font-bold group-hover:text-purple-300 transition-colors">
              {k.char}
            </span>
            {k.letters && (
              <span className="text-[9px] font-mono text-slate-500 group-hover:text-purple-400 tracking-wider">
                {k.letters}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Quick Test Shortcuts */}
      <div className="w-full flex items-center justify-center gap-2 pt-1">
        <button
          onClick={() => {
            playDtmfTone('*');
            playDtmfTone('4');
            playDtmfTone('3');
            onNumberChange('*43');
          }}
          className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-purple-300 border border-purple-500/30 transition"
        >
          *43 (Echo Test)
        </button>
        <button
          onClick={() => {
            onNumberChange('9999');
          }}
          className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 border border-cyan-500/30 transition"
        >
          9999 (Serveur Vocal IVR)
        </button>
        <button
          onClick={() => {
            onNumberChange('1000');
          }}
          className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-emerald-300 border border-emerald-500/30 transition"
        >
          1000 (NOC Support)
        </button>
      </div>

      {/* Main Call Action Buttons */}
      <div className="w-full grid grid-cols-1 gap-3 pt-2">
        <button
          onClick={() => onStartCall(false)}
          disabled={disabled || !dialNumber.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-black text-lg tracking-wide shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-3 transition-all duration-150 active:scale-98 border border-emerald-400/40"
        >
          <Phone className="w-6 h-6 animate-bounce" />
          <span>APPELER (AUDIO HD)</span>
        </button>
      </div>
    </div>
  );
};
