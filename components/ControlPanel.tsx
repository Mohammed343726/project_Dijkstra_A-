import React from 'react';
import { useStore } from '../store/useStore';
import { AlgorithmType } from '../types';
import { SPEEDS } from '../constants';
import { Play, RotateCcw, Trash2, Cpu, Grid3X3, FastForward } from 'lucide-react';
import { clsx } from 'clsx';

export const ControlPanel: React.FC = () => {
  const { 
      setAlgorithm, 
      selectedAlgorithm, 
      runAlgorithm, 
      resetGrid, 
      clearPath, 
      generateMaze,
      isRunning,
      speed,
      setSpeed
  } = useStore();

  return (
    <div className="space-y-8 font-sans">
      
      {/* Algorithm Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={14} /> Algorithm
        </label>
        <div className="grid grid-cols-1 gap-2">
          {Object.values(AlgorithmType).map((algo) => (
            <button
              key={algo}
              onClick={() => setAlgorithm(algo)}
              disabled={isRunning}
              className={clsx(
                "px-4 py-3 text-sm font-medium rounded-lg text-left transition-all duration-200 border",
                selectedAlgorithm === algo
                  ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                  : "bg-surface border-white/5 text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <FastForward size={14} /> Controls
        </label>
        
        <button
            onClick={runAlgorithm}
            disabled={isRunning}
            className="w-full py-4 rounded-lg bg-primary text-black font-bold text-lg hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Play size={20} fill="currentColor" />
            {isRunning ? 'VISUALIZING...' : 'START VISUALIZER'}
        </button>

        <div className="grid grid-cols-2 gap-2">
             <button
                onClick={generateMaze}
                disabled={isRunning}
                className="px-4 py-3 rounded-lg bg-surface border border-white/10 hover:border-white/30 text-white transition-all flex items-center justify-center gap-2 text-xs font-mono"
            >
                <Grid3X3 size={14} />
                MAZE
            </button>
            <button
                onClick={clearPath}
                disabled={isRunning}
                className="px-4 py-3 rounded-lg bg-surface border border-white/10 hover:border-white/30 text-white transition-all flex items-center justify-center gap-2 text-xs font-mono"
            >
                <Trash2 size={14} />
                CLEAR PATH
            </button>
        </div>
        <button
            onClick={resetGrid}
            disabled={isRunning}
            className="w-full px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 transition-all flex items-center justify-center gap-2 text-xs font-mono"
        >
            <RotateCcw size={14} />
            FULL RESET
        </button>
      </div>

      {/* Speed Control */}
      <div className="space-y-3">
         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            Speed
        </label>
        <input 
            type="range" 
            min="0" 
            max="3" 
            step="1"
            className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            value={
                speed === SPEEDS.SLOW ? 0 :
                speed === SPEEDS.MEDIUM ? 1 :
                speed === SPEEDS.FAST ? 2 : 3
            }
            onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val === 0) setSpeed(SPEEDS.SLOW);
                if (val === 1) setSpeed(SPEEDS.MEDIUM);
                if (val === 2) setSpeed(SPEEDS.FAST);
                if (val === 3) setSpeed(SPEEDS.INSTANT);
            }}
        />
        <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase">
            <span>Slow</span>
            <span>Avg</span>
            <span>Fast</span>
            <span>Instant</span>
        </div>
      </div>

    </div>
  );
};