import React, { useState } from 'react';
import { 
  Terminal, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  Copy, 
  Check, 
  Download,
  Filter
} from 'lucide-react';
import { SipPacketLog } from '../../types/sip';

interface SipConsoleProps {
  logs: SipPacketLog[];
  onClearLogs: () => void;
}

export const SipConsole: React.FC<SipConsoleProps> = ({ logs, onClearLogs }) => {
  const [selectedPacket, setSelectedPacket] = useState<SipPacketLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterDirection, setFilterDirection] = useState<'ALL' | 'TX' | 'RX'>('ALL');

  const filteredLogs = logs.filter(l => {
    if (filterDirection === 'ALL') return true;
    return l.direction === filterDirection;
  });

  const handleCopyPayload = (packet: SipPacketLog) => {
    navigator.clipboard.writeText(packet.rawPayload);
    setCopiedId(packet.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono text-xs">
      {/* Header Controls */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="text-white font-bold text-xs uppercase tracking-wider">
            Console de Signalisation SIP (RFC 3261)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['ALL', 'TX', 'RX'] as const).map(d => (
              <button
                key={d}
                onClick={() => setFilterDirection(d)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  filterDirection === d ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="p-1 text-slate-500 hover:text-red-400 transition"
              title="Effacer console"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Split View: Packets list & Selected packet preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-[360px] max-h-[460px]">
        {/* Packet Stream List */}
        <div className="bg-[#070710] border border-slate-800/80 rounded-xl p-2 overflow-y-auto space-y-1.5 custom-scrollbar">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-slate-600 text-xs">
              Aucun paquet SIP capturé. Les messages (REGISTER, INVITE, 200 OK, BYE) apparaîtront ici.
            </div>
          ) : (
            filteredLogs.map(packet => (
              <div
                key={packet.id}
                onClick={() => setSelectedPacket(packet)}
                className={`p-2 rounded-lg cursor-pointer transition border text-[11px] ${
                  selectedPacket?.id === packet.id
                    ? 'bg-purple-950/60 border-purple-500/80 text-white'
                    : 'bg-slate-900/40 hover:bg-slate-900 border-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {packet.direction === 'TX' ? (
                      <span className="flex items-center gap-0.5 text-cyan-400 font-bold">
                        <ArrowUpRight className="w-3.5 h-3.5" /> TX
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                        <ArrowDownLeft className="w-3.5 h-3.5" /> RX
                      </span>
                    )}
                    <span className="font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                      {packet.methodOrCode}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{packet.timestamp}</span>
                </div>

                <div className="text-[10px] text-slate-400 truncate">
                  <span className="text-slate-500">De:</span> {packet.from} &rarr; <span className="text-slate-500">À:</span> {packet.to}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Packet Raw Inspector */}
        <div className="bg-[#05050a] border border-purple-500/30 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
          {selectedPacket ? (
            <div className="flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
                <span className="text-purple-300 font-bold">
                  {selectedPacket.methodOrCode} ({selectedPacket.direction === 'TX' ? 'Envoyé' : 'Reçu'})
                </span>
                <button
                  onClick={() => handleCopyPayload(selectedPacket)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white text-[10px] bg-slate-800 px-2 py-0.5 rounded transition"
                >
                  {copiedId === selectedPacket.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copier SIP</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="flex-1 overflow-y-auto bg-slate-950 p-2.5 rounded-lg text-[10px] text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap select-all custom-scrollbar">
                {selectedPacket.rawPayload}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center p-4">
              <Terminal className="w-8 h-8 text-slate-700 mb-2" />
              <p className="text-xs">Sélectionnez un paquet SIP dans la liste pour inspecter ses en-têtes et le corps SDP (Session Description Protocol).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
