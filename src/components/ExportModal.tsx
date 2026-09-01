import React, { useState } from 'react';
import { Download, Copy, Check, X, FileText, FileSpreadsheet, FileCode } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  toolName: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  formula?: string;
  timestamp?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  toolName,
  inputs,
  results,
  formula,
  timestamp = new Date().toISOString()
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formattedReport = `=====================================================
TENDRY TELECOM LAB - ENGINEERING REPORT
"ENGINEERING THE CONNECTION."
=====================================================
TOOL: ${toolName.toUpperCase()}
TIMESTAMP: ${timestamp}
ENVIRONMENT: Tendry Telecom Platform
-----------------------------------------------------
INPUT PARAMETERS:
${Object.entries(inputs)
  .map(([k, v]) => `  • ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
  .join('\n')}

${formula ? `ENGINEERING FORMULA / METHOD:\n  ${formula}\n\n` : ''}CALCULATION / TEST RESULTS:
${Object.entries(results)
  .map(([k, v]) => `  • ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
  .join('\n')}
=====================================================
Engineered by Tendry Telecom Lab (https://tendrytelecom.com)
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedReport], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${toolName.toLowerCase().replace(/\s+/g, '_')}_report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadCsv = () => {
    const rows = [
      ['SECTION', 'PARAMETER', 'VALUE'],
      ['METADATA', 'TOOL', toolName],
      ['METADATA', 'TIMESTAMP', timestamp],
      ...Object.entries(inputs).map(([k, v]) => ['INPUT', k, typeof v === 'object' ? JSON.stringify(v) : String(v)]),
      ...Object.entries(results).map(([k, v]) => ['RESULT', k, typeof v === 'object' ? JSON.stringify(v) : String(v)])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(i => `"${i.replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${toolName.toLowerCase().replace(/\s+/g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const jsonPayload = {
      brand: 'TENDRY TELECOM LAB',
      tagline: 'ENGINEERING THE CONNECTION.',
      tool: toolName,
      timestamp,
      formula: formula || null,
      inputs,
      results
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${toolName.toLowerCase().replace(/\s+/g, '_')}_export.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0e0e17] border border-white/15 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090912]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white tracking-wide">{title}</h3>
              <p className="text-xs font-mono text-slate-400">Generated Engineering Report Artifact</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-purple-300 font-semibold tracking-wider uppercase">Formatted Telemetry Log</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                {copied ? 'Copied to Clipboard' : 'Copy Text'}
              </button>
            </div>
            <pre className="p-4 bg-[#050508] border border-white/10 rounded-lg text-xs font-mono text-emerald-400/90 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-60">
              {formattedReport}
            </pre>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 font-semibold tracking-wider uppercase block mb-3">Download Data Format</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleDownloadTxt}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#141422] border border-white/10 hover:border-purple-500/50 hover:bg-[#1a1a2e] transition-all text-center group"
              >
                <FileText className="w-6 h-6 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">Text Log (.txt)</span>
                <span className="text-[10px] text-slate-400">Plain text report</span>
              </button>

              <button
                onClick={handleDownloadCsv}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#141422] border border-white/10 hover:border-emerald-500/50 hover:bg-[#1a1a2e] transition-all text-center group"
              >
                <FileSpreadsheet className="w-6 h-6 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">CSV Data (.csv)</span>
                <span className="text-[10px] text-slate-400">Spreadsheet table</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#141422] border border-white/10 hover:border-cyan-500/50 hover:bg-[#1a1a2e] transition-all text-center group"
              >
                <FileCode className="w-6 h-6 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">JSON Schema (.json)</span>
                <span className="text-[10px] text-slate-400">Raw API parameters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-white/10 bg-[#090912]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
