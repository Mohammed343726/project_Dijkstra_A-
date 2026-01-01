import React from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Grid } from './components/Grid';
import { Metrics } from './components/Metrics';

const App: React.FC = () => {
  return (
    <div className="flex h-screen w-screen bg-background text-white overflow-hidden selection:bg-primary selection:text-black">
      {/* Sidebar Controls */}
      <aside className="w-80 h-full flex-shrink-0 border-r border-white/10 bg-surface/50 backdrop-blur-xl flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AlgoViz<span className="font-mono text-white">Pro</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            PATHFINDING VISUALIZATION
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <ControlPanel />
          <Metrics />
        </div>

        <div className="p-4 border-t border-white/10 text-[10px] text-gray-600 font-mono text-center">
          ENGINEERED FOR PERFORMANCE
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 h-full relative flex flex-col bg-background">
        {/* Top Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-10" />
        
        {/* Grid Container */}
        <div className="flex-1 overflow-hidden relative flex items-center justify-center p-8">
            <div className="relative z-0 shadow-2xl shadow-black rounded-lg overflow-hidden border border-white/5">
                <Grid />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;