import React, { useState } from 'react';
import { Globe, Play, Download, Copy, Check, AlertCircle, Server } from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';
import { DnsResponse } from '../types';

export const DnsLookupView: React.FC = () => {
  const [domain, setDomain] = useState('google.com');
  const [queryType, setQueryType] = useState('A');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DnsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA'];

  const runDnsLookup = async () => {
    if (!domain.trim()) {
      setError('Please enter a valid domain name.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/network/dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim(), type: queryType })
      });

      const data: DnsResponse = await response.json();
      if (data.error && (!data.records || data.records.length === 0)) {
        setError(data.error);
        setResult(data);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'DNS resolution request failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyRecord = (val: string, index: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
            DNS RECURSIVE RESOLVER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Live DNS queries querying authoritative nameservers for A, AAAA, MX, CNAME, NS, TXT, and SOA records.
          </p>
        </div>

        {result && result.records && result.records.length > 0 && (
          <button
            onClick={() => setShowExportModal(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export DNS Records
          </button>
        )}
      </div>

      {/* Query Form */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Domain Name
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. cloudflare.com, cisco.com, ietf.org"
              className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Query Record Type
            </label>
            <select
              value={queryType}
              onChange={(e) => setQueryType(e.target.value)}
              className="w-full px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t} Record
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Record Type Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-slate-500 uppercase mr-2">Quick Type:</span>
          {RECORD_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setQueryType(t)}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                queryType === t
                  ? 'bg-purple-600 text-white font-bold border border-purple-400/40'
                  : 'bg-[#090912] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            Resolving via Tier-1 recursive servers (1.1.1.1 / 8.8.8.8)
          </span>
          <button
            onClick={runDnsLookup}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase disabled:opacity-50 transition-all shadow-lg shadow-purple-950"
          >
            <Play className="w-4 h-4 fill-current" />
            {loading ? 'RESOLVING...' : 'QUERY DNS'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-4 text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Table */}
      {result && (
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                DNS RESPONSE FOR {result.domain} ({result.type})
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span>QUERY TIME: <strong className="text-cyan-400">{result.queryTimeMs || 12} ms</strong></span>
              <span>RESOLVER: <strong className="text-white">{result.server || '1.1.1.1'}</strong></span>
            </div>
          </div>

          {result.records.length === 0 ? (
            <div className="text-center py-8 text-slate-500 font-mono text-xs">
              No {result.type} records found for {result.domain}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-3 px-2">TYPE</th>
                    <th className="pb-3 px-2">RECORD VALUE</th>
                    <th className="pb-3 px-2">TTL</th>
                    <th className="pb-3 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {result.records.map((r, i) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                          {r.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-white font-semibold break-all">
                        {r.value}
                      </td>
                      <td className="py-3 px-2 text-slate-400">
                        {r.ttl !== undefined ? `${r.ttl}s` : '300s'}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => copyRecord(r.value, i)}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-purple-400" />}
                          {copiedIndex === i ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && result && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="DNS Query Resolution"
          toolName="DNS Query Resolver"
          inputs={{
            domain: result.domain,
            queryType: result.type,
            resolverServer: result.server
          }}
          results={{
            recordCount: result.records.length,
            records: result.records.map(r => `${r.type}: ${r.value} (TTL: ${r.ttl}s)`),
            queryTime: `${result.queryTimeMs} ms`
          }}
        />
      )}
    </div>
  );
};
