import React, { useState, useMemo } from 'react';
import { Terminal, Search, Copy, Check, Filter, Layers, BookOpen } from 'lucide-react';
import { COMMAND_REFERENCE_LIST, CommandItem } from '../data/commandsData';
import { Badge } from '../components/Badge';

export const CommandReferenceView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCommands = useMemo(() => {
    return COMMAND_REFERENCE_LIST.filter(cmd => {
      const matchSearch =
        cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPlatform = selectedPlatform === 'ALL' || cmd.platform === selectedPlatform;
      return matchSearch && matchPlatform;
    });
  }, [searchTerm, selectedPlatform]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const PLATFORMS = ['ALL', 'Cisco IOS', 'Nokia SR OS', 'Linux', 'Asterisk'];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// CLI & NOS CHEATSHEETS</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            TELECOM NOS COMMAND REFERENCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Production CLI commands for Cisco IOS, Nokia SR OS (MD-CLI), Linux networking, and Asterisk SIP PBX.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search commands, BGP, OSPF, interfaces, routing tables, ping..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#090912] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PLATFORMS.map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                selectedPlatform === plat
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-[#090912] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Command List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCommands.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl glass-panel p-5 border border-white/10 hover:border-purple-500/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                {item.platform}
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                {item.category}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans">
              {item.description}
            </p>

            {/* Command Box */}
            <div className="p-3 rounded-xl bg-[#050508] border border-white/5 font-mono text-xs text-cyan-300 flex items-center justify-between gap-2">
              <code className="break-all">{item.command}</code>
              <button
                onClick={() => handleCopy(item.command, item.id)}
                className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Copy Command"
              >
                {copiedId === item.id ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
