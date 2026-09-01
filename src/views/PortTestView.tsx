import React, { useState } from 'react';
import { Server, Play, Download, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';
import { PortTestResult } from '../types';

export const PortTestView: React.FC = () => {
  const [host, setHost] = useState('cloudflare.com');
  const [port, setPort] = useState('443');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PortTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const COMMON_PORTS = [
    { port: 22, name: 'SSH' },
    { port: 25, name: 'SMTP' },
    { port: 53, name: 'DNS' },
    { port: 80, name: 'HTTP' },
    { port: 110, name: 'POP3' },
    { port: 143, name: 'IMAP' },
    { port: 443, name: 'HTTPS' },
    { port: 5060, name: 'SIP' },
    { port: 5061, name: 'SIPS' },
    { port: 8080, name: 'HTTP-ALT' }
  ];

  const runPortTest = async () => {
    if (!host.trim()) {
      setError('Please enter a target hostname or IP address.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/network/port-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: host.trim(), port })
      });

      const data = await response.json();
      if (!response.ok && !data.status) {
        setError(data.error || 'Failed to complete port connectivity test.');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Port test failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// NETWORK DIAGNOSTICS</span>
            <span>&bull;</span>
            <Badge type="REAL TEST" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            TCP PORT CONNECTIVITY TEST
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Perform controlled TCP 3-way handshake connectivity tests on standard telecom and web service ports.
          </p>
        </div>

        {result && (
          <button
            onClick={() => setShowExportModal(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Result
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Target Hostname / IP
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g. google.com, 1.1.1.1, cisco.com"
              className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Port Number
            </label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="443"
              className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Quick Port Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-slate-500 uppercase mr-2">Common Ports:</span>
          {COMMON_PORTS.map((p) => (
            <button
              key={p.port}
              onClick={() => setPort(String(p.port))}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
                port === String(p.port)
                  ? 'bg-purple-600 text-white font-bold border border-purple-400/40'
                  : 'bg-[#090912] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {p.port} ({p.name})
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-slate-500">
            * Restricted to standard diagnostics (22, 25, 53, 80, 110, 143, 443, 5060, 5061, 8080).
          </span>
          <button
            onClick={runPortTest}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase disabled:opacity-50 transition-all shadow-lg shadow-purple-950"
          >
            <Play className="w-4 h-4 fill-current" />
            {loading ? 'CONNECTING...' : 'TEST PORT'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-4 text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                result.status === 'OPEN'
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-950/60 text-rose-400 border-rose-500/40'
              }`}>
                {result.status === 'OPEN' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-xl text-white">
                    PORT {result.port} ({result.serviceName}) is {result.status}
                  </h3>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Target: <strong className="text-white">{result.host}</strong> &bull; Measured Response: <strong className="text-cyan-400">{result.responseTimeMs} ms</strong>
                </p>
              </div>
            </div>
            <Badge type={result.status === 'OPEN' ? 'REAL TEST' : 'REAL TEST'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 block text-[10px]">SOCKET STATE</span>
              <span className={`text-base font-bold ${result.status === 'OPEN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.status}
              </span>
              <p className="text-[11px] text-slate-400">
                {result.status === 'OPEN' ? 'TCP SYN-ACK handshake established.' : result.error || 'Connection refused or timed out.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 block text-[10px]">ROUND-TRIP HANDSHAKE</span>
              <span className="text-base font-bold text-white">
                {result.responseTimeMs} ms
              </span>
              <p className="text-[11px] text-slate-400">
                Time to complete SYN &rarr; SYN-ACK
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
              <span className="text-slate-500 block text-[10px]">SERVICE CLASSIFICATION</span>
              <span className="text-base font-bold text-purple-400">
                {result.serviceName}
              </span>
              <p className="text-[11px] text-slate-400">
                Standard IANA well-known assignment
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && result && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="TCP Port Connectivity Report"
          toolName="TCP Port Connectivity Test"
          inputs={{
            host: result.host,
            port: result.port,
            service: result.serviceName
          }}
          results={{
            status: result.status,
            handshakeLatency: `${result.responseTimeMs} ms`,
            error: result.error || 'None (Connection established)'
          }}
        />
      )}
    </div>
  );
};
