import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Grid, 
  Share2, 
  Disc, 
  Activity, 
  Volume2, 
  VolumeX,
  Radio,
  Wifi,
  Sparkles,
  Layers
} from 'lucide-react';
import { ActiveCallSession } from '../../types/sip';
import { playDtmfTone } from '../../lib/sipAudio';

interface SipActiveCallProps {
  session: ActiveCallSession;
  onHangup: () => void;
  onToggleMute: () => void;
  onToggleHold: () => void;
  onToggleRecord: () => void;
  onSendDtmf: (digit: string) => void;
}

export const SipActiveCall: React.FC<SipActiveCallProps> = ({
  session,
  onHangup,
  onToggleMute,
  onToggleHold,
  onToggleRecord,
  onSendDtmf
}) => {
  const [showInCallDtmf, setShowInCallDtmf] = useState(false);
  const [showQosDetails, setShowQosDetails] = useState(false);

  // Format Call Duration MM:SS
  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate dynamic audio visualizer bars
  const visualizerHeights = [
    Math.min(90, Math.max(15, session.audioLevel * 0.8 + 20)),
    Math.min(90, Math.max(25, session.audioLevel * 1.1 + 10)),
    Math.min(95, Math.max(30, session.audioLevel * 1.3 + 15)),
    Math.min(90, Math.max(20, session.audioLevel * 0.9 + 25)),
    Math.min(85, Math.max(15, session.audioLevel * 0.7 + 10)),
  ];

  return (
    <div className="max-w-md mx-auto w-full bg-gradient-to-b from-[#0e0e1a] via-[#120f26] to-[#0a0a14] border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-white space-y-6 animate-in zoom-in-95 duration-200">
      {/* Top Banner Status */}
      <div className="w-full flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          {session.state === 'RINGING_OUTGOING' && (
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              SONNERIE (180 RINGING)
            </span>
          )}
          {session.state === 'CONNECTED' && (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              EN LIGNE &bull; {session.codec}
            </span>
          )}
          {session.state === 'ON_HOLD' && (
            <span className="flex items-center gap-1.5 text-orange-400 bg-orange-500/20 px-2.5 py-1 rounded-full border border-orange-500/30">
              <Pause className="w-3.5 h-3.5 animate-pulse" />
              APPEL EN ATTENTE (HOLD)
            </span>
          )}
        </div>

        {session.isRecording && (
          <div className="flex items-center gap-1 text-red-400 bg-red-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold animate-pulse border border-red-500/30">
            <Disc className="w-3 h-3" /> REC
          </div>
        )}
      </div>

      {/* Remote Party Avatar & Information */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 border-2 border-purple-400/60 flex items-center justify-center text-white shadow-2xl shadow-purple-950/80">
            <span className="text-3xl font-heading font-black tracking-wider">
              {session.remoteDisplayName.slice(0, 2).toUpperCase() || 'SIP'}
            </span>
          </div>

          {session.state === 'CONNECTED' && !session.isOnHold && (
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-slate-900">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-heading font-black text-white tracking-tight pt-2">
          {session.remoteDisplayName}
        </h2>
        <div className="text-sm font-mono text-purple-300">
          {session.remoteUri}
        </div>

        {/* Live Timer */}
        <div className="text-3xl font-mono font-bold text-white tracking-widest bg-black/40 px-5 py-1.5 rounded-xl border border-white/10 shadow-inner">
          {session.state === 'RINGING_OUTGOING' ? 'Appel en cours...' : formatDuration(session.durationSeconds)}
        </div>
      </div>

      {/* Dynamic Audio Visualizer */}
      {session.state === 'CONNECTED' && (
        <div className="w-full flex items-center justify-center gap-1.5 h-12 bg-slate-950/60 rounded-2xl p-2 border border-purple-500/20">
          {visualizerHeights.map((h, i) => (
            <div
              key={i}
              className={`w-3 rounded-full transition-all duration-150 ${
                session.isMuted 
                  ? 'bg-red-500/50 h-2' 
                  : session.isOnHold 
                    ? 'bg-amber-500/50 h-3 animate-pulse' 
                    : 'bg-gradient-to-t from-purple-500 to-cyan-400'
              }`}
              style={{ height: session.isMuted ? '6px' : `${h}%` }}
            />
          ))}
        </div>
      )}

      {/* In-Call DTMF Drawer */}
      {showInCallDtmf && (
        <div className="w-full bg-slate-950/90 rounded-2xl p-3 border border-purple-500/40 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 pb-2 border-b border-white/10 mb-2">
            <span>CLAVIER DTMF EN DIRECT</span>
            <button 
              onClick={() => setShowInCallDtmf(false)}
              className="text-slate-400 hover:text-white"
            >
              Fermer
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['1','2','3','4','5','6','7','8','9','*','0','#'].map((d) => (
              <button
                key={d}
                onClick={() => {
                  playDtmfTone(d);
                  onSendDtmf(d);
                }}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-purple-900/50 text-white font-mono font-bold text-lg border border-white/10 transition active:scale-95"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Real-time QoS Metrics Pill */}
      <div className="w-full">
        <button
          onClick={() => setShowQosDetails(!showQosDetails)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-purple-500/30 text-xs font-mono text-slate-300 transition"
        >
          <span className="flex items-center gap-1.5 text-purple-300 font-semibold">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            Qualité Audio : MOS {session.mosScore.toFixed(2)}/5.0 ({session.mosScore > 4 ? 'Excellent' : 'Bon'})
          </span>
          <span className="text-[10px] text-slate-500">
            {showQosDetails ? 'Masquer détails' : 'Détails RTP'}
          </span>
        </button>

        {showQosDetails && (
          <div className="mt-2 p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-[11px] font-mono grid grid-cols-2 gap-2 text-slate-300 animate-in fade-in duration-150">
            <div>
              <span className="text-slate-500 block">Latence RTT :</span>
              <span className="font-bold text-emerald-400">{session.rttMs} ms</span>
            </div>
            <div>
              <span className="text-slate-500 block">Gigue (Jitter) :</span>
              <span className="font-bold text-purple-300">{session.jitterMs} ms</span>
            </div>
            <div>
              <span className="text-slate-500 block">Perte de paquets :</span>
              <span className="font-bold text-emerald-400">{session.packetLossPercent}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Débit RTP :</span>
              <span className="font-bold text-cyan-300">{session.bitrateKbps} kbps</span>
            </div>
          </div>
        )}
      </div>

      {/* In-Call Action Control Grid */}
      <div className="grid grid-cols-4 gap-3 w-full pt-2">
        {/* Mute */}
        <button
          onClick={onToggleMute}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 ${
            session.isMuted 
              ? 'bg-red-600/30 border-red-500 text-red-300 shadow-lg shadow-red-950'
              : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-200'
          }`}
        >
          {session.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span className="text-[10px] font-mono mt-1">{session.isMuted ? 'Muet' : 'Micro'}</span>
        </button>

        {/* Hold */}
        <button
          onClick={onToggleHold}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 ${
            session.isOnHold 
              ? 'bg-amber-600/30 border-amber-500 text-amber-300 shadow-lg shadow-amber-950'
              : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-200'
          }`}
        >
          {session.isOnHold ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          <span className="text-[10px] font-mono mt-1">{session.isOnHold ? 'Reprendre' : 'Attente'}</span>
        </button>

        {/* In-Call Keypad Toggle */}
        <button
          onClick={() => setShowInCallDtmf(!showInCallDtmf)}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 ${
            showInCallDtmf 
              ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-lg shadow-purple-950'
              : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-200'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-mono mt-1">Clavier</span>
        </button>

        {/* Recording */}
        <button
          onClick={onToggleRecord}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 ${
            session.isRecording 
              ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-950 animate-pulse'
              : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-200'
          }`}
        >
          <Disc className="w-5 h-5" />
          <span className="text-[10px] font-mono mt-1">{session.isRecording ? 'Enreg.' : 'Enreg.'}</span>
        </button>
      </div>

      {/* Main End Call Button */}
      <div className="w-full pt-2">
        <button
          onClick={onHangup}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-heading font-black text-lg tracking-wider shadow-xl shadow-red-950/80 flex items-center justify-center gap-3 transition-all duration-150 active:scale-98 border border-red-400/40"
        >
          <PhoneOff className="w-6 h-6" />
          <span>RACCROCHER (SIP BYE)</span>
        </button>
      </div>
    </div>
  );
};
