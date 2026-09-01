import React, { useState, useMemo } from 'react';
import { Network, Download, Copy, Check, Info, Layers, Binary } from 'lucide-react';
import { calculateSubnet } from '../lib/calculators/subnet';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const SubnetCalculatorView: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState(24);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const result = useMemo(() => {
    try {
      return calculateSubnet(ip.trim(), cidr);
    } catch {
      return null;
    }
  }, [ip, cidr]);

  const copyVal = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// IP & ROUTING</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            IPV4 SUBNET & CIDR CALCULATOR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            RFC 1878 / RFC 4632 compliant subnet breakdown with usable host range, broadcast address, wildcard mask, and binary representation.
          </p>
        </div>

        {result && (
          <button
            onClick={() => setShowExportModal(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Calculation
          </button>
        )}
      </div>

      {/* Inputs */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              IPv4 Address (or CIDR string, e.g. 10.0.0.1/16)
            </label>
            <input
              type="text"
              value={ip}
              onChange={(e) => {
                const val = e.target.value;
                if (val.includes('/')) {
                  const [ipPart, cidrPart] = val.split('/');
                  setIp(ipPart);
                  const parsedCidr = parseInt(cidrPart, 10);
                  if (!isNaN(parsedCidr) && parsedCidr >= 1 && parsedCidr <= 32) {
                    setCidr(parsedCidr);
                  }
                } else {
                  setIp(val);
                }
              }}
              placeholder="192.168.1.1"
              className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Prefix / CIDR (/{cidr})
              </label>
              <span className="text-xs font-mono text-purple-400 font-bold">/{cidr}</span>
            </div>
            <input
              type="range"
              min={1}
              max={32}
              value={cidr}
              onChange={(e) => setCidr(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mt-2"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>/1</span>
              <span>/8</span>
              <span>/16</span>
              <span>/24</span>
              <span>/30</span>
              <span>/32</span>
            </div>
          </div>
        </div>

        {/* Quick CIDR Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-slate-500 uppercase mr-2">Common:</span>
          {[8, 16, 24, 25, 26, 27, 28, 29, 30, 31, 32].map((c) => (
            <button
              key={c}
              onClick={() => setCidr(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                cidr === c
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-[#090912] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              /{c}
            </button>
          ))}
        </div>
      </div>

      {/* Calculation Results Display */}
      {result ? (
        <div className="space-y-6">
          {/* Main 4 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl glass-panel p-5 border border-white/10">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">NETWORK ADDRESS</span>
              <div className="text-xl font-heading font-black text-purple-400 mt-1 font-mono">
                {result.networkAddress}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1 block">Subnet Base</span>
            </div>

            <div className="rounded-2xl glass-panel p-5 border border-white/10">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">SUBNET MASK</span>
              <div className="text-xl font-heading font-black text-cyan-400 mt-1 font-mono">
                {result.netmask || result.subnetMask}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1 block">/{result.cidr} CIDR</span>
            </div>

            <div className="rounded-2xl glass-panel p-5 border border-white/10">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">BROADCAST ADDRESS</span>
              <div className="text-xl font-heading font-black text-indigo-300 mt-1 font-mono">
                {result.broadcastAddress}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1 block">Subnet End</span>
            </div>

            <div className="rounded-2xl glass-panel p-5 border border-white/10">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">USABLE HOST COUNT</span>
              <div className="text-xl font-heading font-black text-emerald-400 mt-1 font-mono">
                {(result.usableHosts ?? 0).toLocaleString()}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                Total: {(result.totalHosts ?? result.totalAddresses ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Detailed Breakdown Table */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                  COMPLETE IP SUBNET SPECIFICATION
                </h3>
              </div>
              <span className="text-xs font-mono text-purple-300 font-semibold">
                {result.ipClass} CLASS &bull; {result.scope || (result.isPrivate ? 'RFC 1918 Private' : 'Public Internet')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#090912] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">USABLE HOST RANGE</span>
                  <span className="text-white font-semibold text-sm">
                    {result.firstUsableIp || result.firstUsableHost} &mdash; {result.lastUsableIp || result.lastUsableHost}
                  </span>
                </div>
                <button
                  onClick={() => copyVal(`${result.firstUsableIp || result.firstUsableHost} - ${result.lastUsableIp || result.lastUsableHost}`, 'range')}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  {copiedKey === 'range' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090912] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">WILDCARD (INVERSE MASK)</span>
                  <span className="text-amber-400 font-semibold text-sm">
                    {result.wildcardMask}
                  </span>
                </div>
                <button
                  onClick={() => copyVal(result.wildcardMask, 'wildcard')}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  {copiedKey === 'wildcard' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              </div>
            </div>

            {/* Binary Breakdown */}
            <div className="pt-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                32-BIT BINARY OCTET BREAKDOWN
              </span>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#050508] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500 text-[11px]">IP Address:</span>
                  <span className="text-white tracking-widest">{result.ipBinary}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#050508] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500 text-[11px]">Subnet Mask:</span>
                  <span className="text-cyan-400 tracking-widest">{result.netmaskBinary || result.maskBinary}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
          Invalid IPv4 format. Please enter a valid 4-octet address (0-255.0-255.0-255.0-255).
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && result && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="IPv4 Subnet Calculation"
          toolName="IPv4 Subnet & CIDR Calculator"
          inputs={{
            inputAddress: ip,
            prefixCidr: `/${cidr}`
          }}
          results={{
            networkAddress: result.networkAddress,
            broadcastAddress: result.broadcastAddress,
            subnetMask: result.netmask || result.subnetMask,
            wildcardMask: result.wildcardMask,
            usableHostRange: `${result.firstUsableIp || result.firstUsableHost} - ${result.lastUsableIp || result.lastUsableHost}`,
            usableHostCount: result.usableHosts,
            totalHostCount: result.totalHosts ?? result.totalAddresses,
            ipClass: result.ipClass,
            scope: result.scope || (result.isPrivate ? 'RFC 1918 Private' : 'Public Internet')
          }}
          formula="Usable Hosts = 2^(32 - CIDR) - 2"
        />
      )}
    </div>
  );
};
