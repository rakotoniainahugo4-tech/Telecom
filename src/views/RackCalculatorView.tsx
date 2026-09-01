import React, { useState, useMemo } from 'react';
import { Server, Download, Plus, Trash2, Zap, Layers } from 'lucide-react';
import { calculateRackLayout, EquipmentItem } from '../lib/calculators/rackCalculator';
import { Badge } from '../components/Badge';
import { ExportModal } from '../components/ExportModal';

export const RackCalculatorView: React.FC = () => {
  const [rackHeight, setRackHeight] = useState(42);
  const [items, setItems] = useState<EquipmentItem[]>([
    { id: '1', name: 'Nokia 7750 SR-12 Core Router', heightU: 14, powerWatts: 2400, weightKg: 85, positionU: 1 },
    { id: '2', name: 'Cisco ASR 9006 Aggregation Router', heightU: 10, powerWatts: 1800, weightKg: 65, positionU: 15 },
    { id: '3', name: 'Huawei MA5800 GPON OLT Subrack', heightU: 6, powerWatts: 900, weightKg: 35, positionU: 25 },
    { id: '4', name: 'Fortinet FortiGate 600E Next-Gen Firewall', heightU: 1, powerWatts: 150, weightKg: 8, positionU: 31 },
    { id: '5', name: 'Cat6 48-Port High Density Patch Panel', heightU: 2, powerWatts: 0, weightKg: 4, positionU: 32 },
    { id: '6', name: 'Fiber ODF 96-Core LC/UPC Splice Tray', heightU: 3, powerWatts: 0, weightKg: 6, positionU: 34 }
  ]);

  const [newName, setNewName] = useState('');
  const [newU, setNewU] = useState(1);
  const [newPower, setNewPower] = useState(250);
  const [newWeight, setNewWeight] = useState(10);
  const [showExportModal, setShowExportModal] = useState(false);

  const rackStats = useMemo(() => {
    return calculateRackLayout(rackHeight, items);
  }, [rackHeight, items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Find next available U slot
    const usedSlots = new Set<number>();
    items.forEach(it => {
      for (let u = it.positionU; u < it.positionU + it.heightU; u++) {
        usedSlots.add(u);
      }
    });

    let targetPos = 1;
    for (let u = 1; u <= rackHeight - newU + 1; u++) {
      let fit = true;
      for (let k = 0; k < newU; k++) {
        if (usedSlots.has(u + k)) {
          fit = false;
          break;
        }
      }
      if (fit) {
        targetPos = u;
        break;
      }
    }

    const newItem: EquipmentItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      heightU: newU,
      powerWatts: newPower,
      weightKg: newWeight,
      positionU: targetPos
    };

    setItems([...items, newItem]);
    setNewName('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-1">
            <span>// DATA CENTER & INFRASTRUCTURE</span>
            <span>&bull;</span>
            <Badge type="LOCAL CALCULATION" size="sm" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            42U SERVER & TELECOM RACK BUILDER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Interactive rack elevation visualizer, vertical U-slot positioning, cumulative power draw, thermal heat dissipation (BTU/hr), and floor weight loading.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-medium transition-colors"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Export Elevation
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">RACK SPACE UTILIZATION</span>
          <div className="text-3xl font-bold text-cyan-400 font-heading">
            {rackStats.usedU} / {rackStats.totalU} <span className="text-xs font-mono text-slate-400">U</span>
          </div>
          <span className="text-[10px] text-slate-400">({rackStats.utilizationPercent}% filled &bull; {rackStats.availableU}U free)</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">TOTAL POWER DRAW</span>
          <div className="text-3xl font-bold text-purple-400 font-heading">
            {(rackStats?.totalPowerWatts ?? 0).toLocaleString()} <span className="text-xs font-mono text-slate-400">W</span>
          </div>
          <span className="text-[10px] text-slate-400">{((rackStats?.totalPowerWatts ?? 0) / 1000).toFixed(2)} kW active load</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">HEAT DISSIPATION</span>
          <div className="text-3xl font-bold text-amber-400 font-heading">
            {(rackStats?.totalHeatBtuPerHour ?? 0).toLocaleString()} <span className="text-xs font-mono text-slate-400">BTU/hr</span>
          </div>
          <span className="text-[10px] text-slate-400">({rackStats?.requiredCoolingTons ?? 0} Tons HVAC cooling)</span>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-1">
          <span className="text-slate-500 uppercase text-[10px]">TOTAL RACK WEIGHT</span>
          <div className="text-3xl font-bold text-emerald-400 font-heading">
            {rackStats.totalWeightKg} <span className="text-xs font-mono text-slate-400">kg</span>
          </div>
          <span className="text-[10px] text-slate-400">Floor payload distribution</span>
        </div>
      </div>

      {/* Main Grid: Add Item Form + Interactive 42U Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Add Equipment & Inventory Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Add Form */}
          <form onSubmit={handleAddItem} className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
              ADD RACK-MOUNT EQUIPMENT
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Equipment Name / Model</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Cisco Catalyst 9300 48P Switch"
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Rack Height (U)</label>
                <select
                  value={newU}
                  onChange={(e) => setNewU(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-xs font-mono text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16].map(u => (
                    <option key={u} value={u}>{u}U Unit</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Power Draw (Watts)</label>
                <input
                  type="number"
                  value={newPower}
                  onChange={(e) => setNewPower(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#090912] border border-white/10 rounded-lg text-xs font-mono text-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Mount In Rack
                </button>
              </div>
            </div>
          </form>

          {/* Installed Inventory List */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
              INSTALLED CHASSIS INVENTORY ({items.length} DEVICES)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-2 px-2">SLOT</th>
                    <th className="pb-2 px-2">DEVICE NAME</th>
                    <th className="pb-2 px-2">SIZE</th>
                    <th className="pb-2 px-2">POWER</th>
                    <th className="pb-2 px-2">WEIGHT</th>
                    <th className="pb-2 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((it) => (
                    <tr key={it.id} className="hover:bg-white/5">
                      <td className="py-2.5 px-2 font-bold text-purple-400">
                        U{it.positionU}-U{it.positionU + it.heightU - 1}
                      </td>
                      <td className="py-2.5 px-2 text-white font-semibold">{it.name}</td>
                      <td className="py-2.5 px-2 text-cyan-300">{it.heightU}U</td>
                      <td className="py-2.5 px-2 text-amber-300">{it.powerWatts}W</td>
                      <td className="py-2.5 px-2 text-slate-400">{it.weightKg}kg</td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={() => handleRemoveItem(it.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive 42U Rack Elevation (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              <h3 className="font-heading font-bold text-sm text-white tracking-wider uppercase">
                42U RACK ELEVATION SCHEMATIC
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">TOP &rarr; U42</span>
          </div>

          {/* Graphical 42U Frame */}
          <div className="bg-[#050508] border-2 border-slate-700 rounded-xl p-3 max-h-[580px] overflow-y-auto space-y-1 scrollbar-thin">
            {Array.from({ length: rackHeight }, (_, i) => {
              const uNum = rackHeight - i; // 42 down to 1
              // Check if an item covers this U
              const item = items.find(it => uNum >= it.positionU && uNum < it.positionU + it.heightU);
              const isTopSlotOfItem = item && uNum === (item.positionU + item.heightU - 1);

              if (item) {
                if (isTopSlotOfItem) {
                  return (
                    <div
                      key={uNum}
                      style={{ height: `${item.heightU * 24}px` }}
                      className="w-full rounded bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/50 p-2 flex items-center justify-between shadow-sm relative group overflow-hidden"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-900/40">
                          U{item.positionU}-{item.positionU + item.heightU - 1}
                        </span>
                        <span className="text-xs font-mono font-bold text-white truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-300 flex-shrink-0">
                        {item.powerWatts}W
                      </div>
                    </div>
                  );
                }
                return null; // Covered by top slot div
              }

              return (
                <div
                  key={uNum}
                  className="h-5 rounded border border-dashed border-white/5 bg-black/40 px-2 flex items-center justify-between text-[9px] font-mono text-slate-600 hover:border-purple-500/30 transition-colors"
                >
                  <span>U{uNum}</span>
                  <span>AVAILABLE</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="42U Server Rack Elevation"
          toolName="42U Server Rack Builder"
          inputs={{
            rackHeightUnits: `${rackHeight}U`,
            mountedDevicesCount: items.length
          }}
          results={{
            usedRackUnits: `${rackStats.usedU} U`,
            availableRackUnits: `${rackStats.availableU} U`,
            utilization: `${rackStats.utilizationPercent}%`,
            totalPowerDraw: `${rackStats.totalPowerWatts} Watts`,
            heatDissipationBtuPerHour: `${rackStats.totalHeatBtuPerHour} BTU/hr`,
            coolingTonsRequired: `${rackStats.requiredCoolingTons} Tons`,
            totalWeight: `${rackStats.totalWeightKg} kg`
          }}
          formula="BTU/hr = Watts * 3.412142; Cooling Tons = BTU/hr / 12000"
        />
      )}
    </div>
  );
};
