import React, { useState } from 'react';
import { 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  PhoneCall, 
  Trash2, 
  Clock, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { CallLogItem } from '../../types/sip';

interface SipCallHistoryProps {
  logs: CallLogItem[];
  onCallNumber: (num: string) => void;
  onClearHistory: () => void;
}

export const SipCallHistory: React.FC<SipCallHistoryProps> = ({
  logs,
  onCallNumber,
  onClearHistory
}) => {
  const [filter, setFilter] = useState<'ALL' | 'MISSED' | 'OUTGOING' | 'INCOMING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'MISSED' && log.status !== 'MISSED') return false;
    if (filter === 'OUTGOING' && log.direction !== 'OUTGOING') return false;
    if (filter === 'INCOMING' && log.direction !== 'INCOMING') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return log.name.toLowerCase().includes(q) || log.number.toLowerCase().includes(q);
    }
    return true;
  });

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds === 0) return '--';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans l'historique..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500 font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'MISSED', 'OUTGOING', 'INCOMING'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'ALL' ? 'Tous' : f === 'MISSED' ? 'Manqués' : f === 'OUTGOING' ? 'Émis' : 'Reçus'}
            </button>
          ))}
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearHistory}
            className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
            title="Effacer tout l'historique"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[340px] max-h-[460px]">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-2">
            <Clock className="w-8 h-8 text-slate-600" />
            <p className="text-xs font-mono">Aucun appel dans l'historique</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 transition group"
            >
              <div className="flex items-center gap-3">
                {/* Icon Direction */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  log.status === 'MISSED'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : log.direction === 'OUTGOING'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {log.status === 'MISSED' ? (
                    <PhoneMissed className="w-4 h-4" />
                  ) : log.direction === 'OUTGOING' ? (
                    <PhoneOutgoing className="w-4 h-4" />
                  ) : (
                    <PhoneIncoming className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">{log.name}</span>
                    <span className="text-[10px] font-mono text-purple-300">({log.number})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span>{formatTime(log.timestamp)}</span>
                    <span>&bull;</span>
                    <span>Durée: {formatDuration(log.durationSeconds)}</span>
                    <span>&bull;</span>
                    <span className="text-slate-400">{log.codec}</span>
                  </div>
                </div>
              </div>

              {/* Call Back Button */}
              <button
                onClick={() => onCallNumber(log.number)}
                className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-mono font-semibold transition flex items-center gap-1.5 active:scale-95 opacity-80 group-hover:opacity-100"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Rappeler</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
