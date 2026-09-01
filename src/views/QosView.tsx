import React, { useState } from 'react';
import { Layers, Download, Check, ShieldCheck, Activity } from 'lucide-react';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

interface QosClass {
  name: string;
  dscpName: string;
  dscpValue: number;
  ipPrecedence: number;
  expBits: number;
  trafficType: string;
  maxDelayMs: number;
  maxJitterMs: number;
  maxLossPercent: number;
  queueMechanism: string;
}

const QOS_CLASSES: QosClass[] = [
  {
    name: 'Voice / Expedited Forwarding (EF)',
    dscpName: 'EF (DSCP 46)',
    dscpValue: 46,
    ipPrecedence: 5,
    expBits: 5,
    trafficType: 'Live Voice RTP Audio Streams',
    maxDelayMs: 150,
    maxJitterMs: 30,
    maxLossPercent: 1.0,
    queueMechanism: 'Priority Queue (Strict PQ / LLQ)'
  },
  {
    name: 'Broadcast Video / Interactive (AF41)',
    dscpName: 'AF41 (DSCP 34)',
    dscpValue: 34,
    ipPrecedence: 4,
    expBits: 4,
    trafficType: 'Video Conferencing (SIP/H.323)',
    maxDelayMs: 200,
    maxJitterMs: 30,
    maxLossPercent: 1.0,
    queueMechanism: 'Class-Based Weighted Fair Queuing (CBWFQ)'
  },
  {
    name: 'Call Signaling (CS3 / AF31)',
    dscpName: 'CS3 (DSCP 24) / AF31 (DSCP 26)',
    dscpValue: 26,
    ipPrecedence: 3,
    expBits: 3,
    trafficType: 'SIP, H.248, Skinny Signaling',
    maxDelayMs: 250,
    maxJitterMs: 50,
    maxLossPercent: 2.0,
    queueMechanism: 'Bandwidth Guaranteed (CBWFQ)'
  },
  {
    name: 'Mission-Critical Data (AF21)',
    dscpName: 'AF21 (DSCP 18)',
    dscpValue: 18,
    ipPrecedence: 2,
    expBits: 2,
    trafficType: 'ERP, Banking Transactions, Database',
    maxDelayMs: 300,
    maxJitterMs: 100,
    maxLossPercent: 2.0,
    queueMechanism: 'Weighted RED (WRED) + CBWFQ'
  },
  {
    name: 'Best Effort Default (DF)',
    dscpName: 'CS0 (DSCP 0)',
    dscpValue: 0,
    ipPrecedence: 0,
    expBits: 0,
    trafficType: 'Standard Internet Web, Email, FTP',
    maxDelayMs: 1000,
    maxJitterMs: 500,
    maxLossPercent: 5.0,
    queueMechanism: 'First-In First-Out (FIFO) / Default'
  },
  {
    name: 'Scavenger / Bulk Data (CS1)',
    dscpName: 'CS1 (DSCP 8)',
    dscpValue: 8,
    ipPrecedence: 1,
    expBits: 1,
    trafficType: 'P2P, Software Updates, Backups',
    maxDelayMs: 2000,
    maxJitterMs: 1000,
    maxLossPercent: 10.0,
    queueMechanism: 'Lowest Priority / Drop on Congestion'
  }
];

export const QosView: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<QosClass>(QOS_CLASSES[0]);
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// TRAFFIC ENGINEERING & SLA</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            QOS DSCP & MPLS EXP CLASS OF SERVICE MATRIX
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Mapping matrix for DiffServ DSCP (RFC 2474/2597/3246), IP Precedence, MPLS EXP bit markings, queue scheduling, and ITU-T Y.1541 SLA performance thresholds.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export QoS Matrix
        </button>
      </div>

      {/* Class Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {QOS_CLASSES.map((cls) => {
          const isSelected = selectedClass.name === cls.name;
          return (
            <button
              key={cls.name}
              onClick={() => setSelectedClass(cls)}
              className={`p-3.5 rounded-xl text-left font-mono transition-all border ${
                isSelected
                  ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg'
                  : 'bg-[#090912] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <div className="text-xs font-bold truncate">{cls.dscpName.split(' ')[0]}</div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">{cls.trafficType.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Active Class Deep-Dive Card */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <h2 className="font-heading font-black text-xl text-white tracking-tight">
              {selectedClass.name}
            </h2>
            <p className="text-xs font-mono text-purple-300 mt-0.5">
              Intended Traffic: {selectedClass.trafficType}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 self-start sm:self-auto">
            {selectedClass.queueMechanism}
          </span>
        </div>

        {/* 4 Technical Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">DSCP VALUE (6-BIT)</span>
            <div className="text-2xl font-bold text-purple-400 font-heading">
              {selectedClass.dscpValue}
            </div>
            <span className="text-[10px] text-slate-400">Binary: {selectedClass.dscpValue.toString(2).padStart(6, '0')}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">IP PRECEDENCE (3-BIT)</span>
            <div className="text-2xl font-bold text-cyan-400 font-heading">
              {selectedClass.ipPrecedence}
            </div>
            <span className="text-[10px] text-slate-400">Legacy ToS Byte</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">MPLS EXP / TC (3-BIT)</span>
            <div className="text-2xl font-bold text-emerald-400 font-heading">
              {selectedClass.expBits}
            </div>
            <span className="text-[10px] text-slate-400">MPLS Shim Header Bits</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090912] border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">ITU-T Y.1541 CLASS</span>
            <div className="text-2xl font-bold text-amber-400 font-heading">
              Class {selectedClass.ipPrecedence <= 1 ? '4/5' : selectedClass.ipPrecedence >= 4 ? '0/1' : '2/3'}
            </div>
            <span className="text-[10px] text-slate-400">Carrier SLA Profile</span>
          </div>
        </div>

        {/* Carrier SLA Thresholds */}
        <div className="rounded-xl bg-[#050508] border border-white/5 p-4 space-y-2 text-xs font-mono">
          <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-2">
            Target SLA Quality Constraints (Maximum Allowable):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-300">
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-500 block text-[10px]">ONE-WAY DELAY (LATENCY)</span>
              <span className="text-base font-bold text-white">&le; {selectedClass.maxDelayMs} ms</span>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-500 block text-[10px]">PACKET JITTER (IPDV)</span>
              <span className="text-base font-bold text-cyan-300">&le; {selectedClass.maxJitterMs} ms</span>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-500 block text-[10px]">PACKET LOSS RATIO (PLR)</span>
              <span className="text-base font-bold text-emerald-300">&le; {selectedClass.maxLossPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="QoS Class of Service Specification"
          toolName="QoS DSCP & MPLS EXP Matrix"
          inputs={{
            selectedClass: selectedClass.name,
            trafficType: selectedClass.trafficType
          }}
          results={{
            dscpValue: selectedClass.dscpValue,
            ipPrecedence: selectedClass.ipPrecedence,
            mplsExpBits: selectedClass.expBits,
            maxLatencyMs: `${selectedClass.maxDelayMs} ms`,
            maxJitterMs: `${selectedClass.maxJitterMs} ms`,
            maxLossPercent: `${selectedClass.maxLossPercent}%`,
            queuingAlgorithm: selectedClass.queueMechanism
          }}
        />
      )}
    </div>
  );
};
