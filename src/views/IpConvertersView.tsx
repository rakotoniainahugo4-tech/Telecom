import React, { useState, useMemo } from 'react';
import { Binary, Download, Copy, Check, Hash } from 'lucide-react';
import { convertIpv4 } from '../lib/calculators/ipConverters';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const IpConvertersView: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.100');
  const [copied, setCopied] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const converted = useMemo(() => {
    try {
      return convertIpv4(ip);
    } catch {
      return {
        dottedDecimal: ip,
        binary: '00000000.00000000.00000000.00000000',
        hexadecimal: '0x00000000',
        integer: 0,
        reverseDnsArpa: 'in-addr.arpa'
      };
    }
  }, [ip]);

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
            <span>// IP CONVERTERS & FORMATS</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            IP DECIMAL &harr; BINARY &harr; HEX &harr; INTEGER MATRIX
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Convert IPv4 dotted decimal notation into 32-bit binary octets, hexadecimal, unsigned 32-bit integer, and IN-ADDR.ARPA reverse DNS pointer.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export Formats
        </button>
      </div>

      {/* Input IP Address */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <label className="block text-xs font-mono text-slate-400 uppercase">
          Enter IPv4 Dotted Decimal Address
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.100"
            className="flex-1 px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-purple-500"
          />

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-mono text-slate-500 uppercase">Presets:</span>
            {['192.168.1.1', '10.0.0.1', '172.16.254.1', '8.8.8.8', '1.1.1.1'].map(p => (
              <button
                key={p}
                onClick={() => setIp(p)}
                className="px-2.5 py-1 text-xs font-mono rounded-lg bg-[#090912] hover:bg-[#151522] border border-white/10 text-slate-300 whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dotted Decimal */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase">
              1. DOTTED DECIMAL (STANDARD)
            </span>
            <button
              onClick={() => handleCopy(converted.dottedDecimal, 'dec')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              {copied === 'dec' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-[#090912] border border-white/5 font-mono text-lg font-bold text-white break-all">
            {converted.dottedDecimal}
          </div>
          <p className="text-[11px] font-mono text-slate-500">Standard 4-octet human-readable notation (8 bits per octet)</p>
        </div>

        {/* 32-bit Binary */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
              2. 32-BIT BINARY OCTETS
            </span>
            <button
              onClick={() => handleCopy(converted.binary, 'bin')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              {copied === 'bin' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-[#090912] border border-white/5 font-mono text-base font-bold text-cyan-300 break-all">
            {converted.binary}
          </div>
          <p className="text-[11px] font-mono text-slate-500">Raw bitstream processed in router ASIC hardware forwarding pipelines</p>
        </div>

        {/* Hexadecimal */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              3. HEXADECIMAL (BASE-16)
            </span>
            <button
              onClick={() => handleCopy(converted.hexadecimal, 'hex')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              {copied === 'hex' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-[#090912] border border-white/5 font-mono text-lg font-bold text-emerald-300 break-all">
            {converted.hexadecimal}
          </div>
          <p className="text-[11px] font-mono text-slate-500">Hex format commonly used in packet analyzer byte captures</p>
        </div>

        {/* 32-bit Integer */}
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">
              4. UNSIGNED 32-BIT INTEGER (DECIMAL)
            </span>
            <button
              onClick={() => handleCopy(converted.integer.toString(), 'int')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              {copied === 'int' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-[#090912] border border-white/5 font-mono text-lg font-bold text-amber-300 break-all">
            {converted.integer}
          </div>
          <p className="text-[11px] font-mono text-slate-500">Database and routing index storage format (0 to 4,294,967,295)</p>
        </div>
      </div>

      {/* Reverse DNS In-Addr.Arpa Pointer */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase">
            REVERSE DNS POINTER (IN-ADDR.ARPA)
          </span>
          <button
            onClick={() => handleCopy(converted.reverseDnsArpa, 'arpa')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            {copied === 'arpa' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-3.5 rounded-xl bg-[#090912] border border-white/5 font-mono text-base font-bold text-purple-300">
          {converted.reverseDnsArpa}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="IPv4 Multi-Format Representation"
          toolName="IP Address Format Converter"
          inputs={{
            inputAddress: ip
          }}
          results={{
            dottedDecimal: converted.dottedDecimal,
            binary: converted.binary,
            hexadecimal: converted.hexadecimal,
            integer: converted.integer,
            reverseDnsArpa: converted.reverseDnsArpa
          }}
        />
      )}
    </div>
  );
};
