import React, { useState, useMemo } from 'react';
import { Network, Download, Copy, Check, Hash, Layers } from 'lucide-react';
import { calculateIpv6 } from '../lib/calculators/ipv6';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const Ipv6CalculatorView: React.FC = () => {
  const [address, setAddress] = useState('2001:db8:85a3::8a2e:370:7334');
  const [prefixLength, setPrefixLength] = useState(64);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const ipv6 = useMemo(() => {
    try {
      const fullInput = `${address.split('/')[0].trim()}/${prefixLength}`;
      const res = calculateIpv6(fullInput);
      return {
        ...res,
        isValid: true
      };
    } catch {
      return {
        address,
        prefix: prefixLength,
        expanded: 'Invalid IPv6',
        compressed: 'Invalid IPv6',
        networkPrefix: 'Invalid',
        hostPortion: 'Invalid',
        type: 'Invalid',
        totalAddressesNotation: '0',
        isValid: false
      };
    }
  }, [address, prefixLength]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// IP NETWORKING & ROUTING</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            IPV6 SUBNET & ADDRESS EXPANDER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            RFC 4291/5952 IPv6 compression & expansion, 128-bit prefix breakdown, and SLAAC /48 to /64 subnetting.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export IPv6 Sizing
        </button>
      </div>

      {/* Input Parameters */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
              IPv6 Address (Compressed or Expanded)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="2001:db8::1"
              className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
              Prefix Length: /{prefixLength}
            </label>
            <select
              value={prefixLength}
              onChange={(e) => setPrefixLength(parseInt(e.target.value, 10))}
              className="w-full px-3 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white"
            >
              <option value={32}>/32 (ISP Allocation / RIR Block)</option>
              <option value={48}>/48 (Enterprise Site Allocation)</option>
              <option value={56}>/56 (Small Business / Residential Pool)</option>
              <option value={60}>/60 (Residential Sub-allocation)</option>
              <option value={64}>/64 (Standard SLAAC End Subnet)</option>
              <option value={126}>/126 (P2P Link / Point-to-Point)</option>
              <option value={128}>/128 (Single Host / Loopback)</option>
            </select>
          </div>
        </div>
      </div>

      {/* IPv6 Calculations Overview */}
      {ipv6.isValid ? (
        <div className="space-y-6">
          {/* 3 Main View Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Compressed */}
            <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                  RFC 5952 Canonical Compressed
                </span>
                <button
                  onClick={() => handleCopy(ipv6.compressed, 'comp')}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  {copied === 'comp' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-white break-all">
                {ipv6.compressed} /{prefixLength}
              </div>
            </div>

            {/* Fully Expanded */}
            <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  Fully Expanded 8-Hextet (128-bit)
                </span>
                <button
                  onClick={() => handleCopy(ipv6.expanded, 'exp')}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  {copied === 'exp' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-sm sm:text-base font-mono font-bold text-slate-200 break-all">
                {ipv6.expanded}
              </div>
            </div>
          </div>

          {/* Detailed Subnet Breakdown Matrix */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
              IPV6 SUBNET & SCOPE BREAKDOWN
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">ROUTED NETWORK PREFIX</span>
                <div className="text-sm font-bold text-purple-300 break-all">{ipv6.networkPrefix}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">HOST / INTERFACE ID PORTION</span>
                <div className="text-xs font-bold text-cyan-300 break-all">{ipv6.hostPortion}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">ADDRESS SCOPE & TYPE</span>
                <div className="text-sm font-bold text-emerald-400">{ipv6.type}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
                <span className="text-slate-500 uppercase text-[10px]">TOTAL IPV6 ADDRESSES</span>
                <div className="text-sm font-bold text-white">{ipv6.totalAddressesNotation}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel p-6 border border-rose-500/30 text-rose-300 text-xs font-mono">
          Invalid IPv6 address syntax. Please verify hexadecimal hextets separated by colons.
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && ipv6.isValid && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="IPv6 Subnetting Analysis"
          toolName="IPv6 Subnet & Expander"
          inputs={{
            rawAddress: address,
            prefixLength: `/${prefixLength}`
          }}
          results={{
            compressed: ipv6.compressed,
            expanded: ipv6.expanded,
            networkPrefix: ipv6.networkPrefix,
            type: ipv6.type,
            totalAddressesNotation: ipv6.totalAddressesNotation
          }}
        />
      )}
    </div>
  );
};
