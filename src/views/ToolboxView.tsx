import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Wrench, 
  Filter, 
  ChevronRight, 
  Activity, 
  Radio, 
  Network, 
  Cpu, 
  Zap, 
  PhoneCall, 
  Sliders, 
  BatteryCharging, 
  Gauge, 
  Layers 
} from 'lucide-react';
import { ALL_TOOLS } from '../data/toolsData';
import { Badge } from '../components/Badge';
import { ToolCategory } from '../types';

interface ToolboxViewProps {
  onNavigate: (path: string) => void;
}

const CATEGORIES: ToolCategory[] = [
  'ALL',
  'NETWORK',
  'IP',
  'MPLS',
  'MOBILE',
  'FIBER',
  'RF',
  'TRANSMISSION',
  'VOIP',
  'QOS',
  'POWER',
  'DIAGNOSTICS'
];

export const ToolboxView: React.FC<ToolboxViewProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'ALL' || tool.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.badge.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-widest">
          <span>// TELECOM ENGINEERING TOOLBOX</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          TELECOM ENGINEERING TOOLBOX
        </h1>
        <p className="text-slate-300 font-sans text-sm sm:text-base max-w-2xl">
          "Test. Calculate. Analyze. Troubleshoot." Real diagnostics, RFC-compliant network calculators, radio link budgeters, and fiber optics.
        </p>
      </div>

      {/* Search Bar & Category Filter Chips */}
      <div className="space-y-4 mb-10">
        {/* Search Input */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search an engineering tool (e.g., subnet, ping, fiber, FSPL, VoIP)..."
            className="w-full pl-11 pr-4 py-3 bg-[#0e0e17] border border-white/10 rounded-xl text-sm font-sans text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950 border border-purple-400/40'
                    : 'bg-[#0e0e17] text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Count Indicator */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 text-xs font-mono text-slate-400">
        <span>SHOWING {filteredTools.length} OF {ALL_TOOLS.length} ENGINEERING TOOLS</span>
        <span className="hidden sm:inline text-[11px] text-purple-400">SELECT A TOOL TO LAUNCH</span>
      </div>

      {/* Tool Cards Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass-panel border border-white/10 space-y-3">
          <Wrench className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">No tools found</h3>
          <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
            No tools matched your search query "{searchQuery}". Try selecting a different category or clearing filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
            className="px-4 py-2 text-xs font-mono rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.route)}
                className="group relative rounded-2xl glass-panel p-6 border border-white/10 hover:border-purple-500/50 hover:bg-[#12121f] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <Badge type={tool.badge} size="sm" />
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-purple-300 transition-colors mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-3 mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-purple-400 group-hover:text-purple-300">
                  <span className="uppercase font-semibold tracking-wider">Launch Tool</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
