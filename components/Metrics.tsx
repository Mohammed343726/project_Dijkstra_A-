import React from 'react';
import { useStore } from '../store/useStore';
import { Activity, Clock, MapPin } from 'lucide-react';

export const Metrics: React.FC = () => {
  const { stats } = useStore();

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} /> Metrics
      </label>
      
      <div className="grid grid-cols-1 gap-3">
        
        {/* Card 1 */}
        <div className="bg-surface/50 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <MapPin size={18} />
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-mono">Visited</p>
                    <p className="text-xl font-bold font-mono text-white">{stats.visitedCount}</p>
                </div>
            </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface/50 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-path/30 transition-colors">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                    <Activity size={18} />
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-mono">Path Cost</p>
                    <p className="text-xl font-bold font-mono text-white">{stats.pathLength}</p>
                </div>
            </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface/50 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-green-500/30 transition-colors">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                    <Clock size={18} />
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-mono">Time (ms)</p>
                    <p className="text-xl font-bold font-mono text-white">{stats.timeElapsed}</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};