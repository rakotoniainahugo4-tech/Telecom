import React, { useState } from 'react';
import { ShieldCheck, Play, Download, AlertCircle, CheckCircle2, Globe, Clock, Layers } from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';
import { HttpTestResult } from '../types';

export const HttpTestView: React.FC = () => {
  const [url, setUrl] = useState('https://cloudflare.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HttpTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const runHttpTest = async () => {
    if (!url.trim()) {
      setError('Please enter a target URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/network/http-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();
      if (!response.ok && !data.status) {
        setError(data.error || 'HTTP diagnostic probe failed.');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'HTTP test failed.');
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
            HTTP / HTTPS WEB PROBE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Analyze HTTP response status codes, TTFB response times, server headers, and redirects with SSRF protection.
          </p>
        </div>

        {result && (
          <button
            onClick={() => setShowExportModal(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            Export Report
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Target URL (HTTP or HTTPS)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 bg-[#090912] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={runHttpTest}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase disabled:opacity-50 transition-all shadow-lg shadow-purple-950"
            >
              <Play className="w-4 h-4 fill-current" />
              {loading ? 'PROBING...' : 'RUN HTTP PROBE'}
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SSRF Protected: Private IPs (10.x, 192.168.x, 172.16-31.x, 127.0.0.1, 169.254.x) are strictly blocked.</span>
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
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">HTTP STATUS</span>
              <div className={`text-2xl font-heading font-black mt-1 ${
                result.status && result.status >= 200 && result.status < 400 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {result.status || 'N/A'} {result.statusText || ''}
              </div>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">RESPONSE TIME</span>
              <div className="text-2xl font-heading font-black text-cyan-400 mt-1">
                {result.responseTimeMs} <span className="text-xs font-mono text-slate-400">ms</span>
              </div>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">CONTENT-TYPE</span>
              <div className="text-sm font-heading font-bold text-white mt-1 truncate">
                {result.contentType || 'unknown'}
              </div>
            </div>

            <div className="rounded-2xl glass-panel p-4 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">SERVER HEADER</span>
              <div className="text-sm font-heading font-bold text-purple-400 mt-1 truncate">
                {result.serverHeader || 'Hidden'}
              </div>
            </div>
          </div>

          {/* Response Headers Table */}
          {result.headers && (
            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                    HTTP RESPONSE HEADERS
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">{Object.keys(result.headers).length} Headers Returned</span>
              </div>

              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-2 px-2">HEADER NAME</th>
                      <th className="pb-2 px-2">VALUE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {Object.entries(result.headers).map(([k, v]) => (
                      <tr key={k} className="hover:bg-white/5">
                        <td className="py-2.5 px-2 text-purple-300 font-semibold">{k}</td>
                        <td className="py-2.5 px-2 text-slate-300 break-all">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && result && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="HTTP Probe Report"
          toolName="HTTP / HTTPS Web Probe"
          inputs={{
            targetUrl: result.url
          }}
          results={{
            statusCode: result.status,
            statusText: result.statusText,
            responseTime: `${result.responseTimeMs} ms`,
            contentType: result.contentType,
            server: result.serverHeader,
            headers: result.headers
          }}
        />
      )}
    </div>
  );
};
