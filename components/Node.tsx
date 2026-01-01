import React from 'react';
import { NodeType } from '../types';
import { motion, Variants } from 'framer-motion';
import { clsx } from 'clsx';
import { useStore } from '../store/useStore';

interface NodeProps {
  row: number;
  col: number;
  type: NodeType;
}

// Memoize to prevent unnecessary re-renders of all 1000 nodes when one changes
export const Node: React.FC<NodeProps> = React.memo(({ row, col, type }) => {
  const { handleMouseDown, handleMouseEnter, handleMouseUp } = useStore();

  const getBackgroundColor = (t: NodeType) => {
    switch (t) {
      case NodeType.WALL: return 'bg-wall border-wall shadow-inner';
      case NodeType.START: return 'bg-primary shadow-[0_0_15px_#39FF14] z-10 scale-110';
      case NodeType.END: return 'bg-secondary shadow-[0_0_15px_#FF00FF] z-10 scale-110';
      case NodeType.VISITED: return 'bg-accent/40 border-accent/20 animate-pulse-fast'; // Using CSS animation for perf
      case NodeType.PATH: return 'bg-path shadow-[0_0_15px_#FFD700] z-20 border-none';
      default: return 'bg-transparent border-white/5 hover:bg-white/10';
    }
  };

  const variants: Variants = {
    initial: { scale: 1, opacity: 1 },
    visited: { 
        scale: [0.8, 1.2, 1],
        borderRadius: ["50%", "20%", "0%"],
        transition: { duration: 0.3 }
    },
    path: { 
        scale: 1.1,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    wall: {
        scale: [0.9, 1],
        transition: { duration: 0.2 }
    }
  };

  const getVariant = (t: NodeType) => {
      if (t === NodeType.VISITED) return 'visited';
      if (t === NodeType.PATH) return 'path';
      if (t === NodeType.WALL) return 'wall';
      return 'initial';
  };

  return (
    <motion.div
      layout // Helps smooth transitions
      initial="initial"
      animate={getVariant(type)}
      variants={variants}
      className={clsx(
        "w-6 h-6 border transition-colors duration-200 cursor-pointer flex items-center justify-center",
        getBackgroundColor(type)
      )}
      onMouseDown={() => handleMouseDown(row, col)}
      onMouseEnter={() => handleMouseEnter(row, col)}
      onMouseUp={handleMouseUp}
    >
        {/* Optional Icon Overlay */}
        {type === NodeType.START && <div className="w-2 h-2 bg-black rounded-full" />}
        {type === NodeType.END && <div className="w-2 h-2 bg-black rounded-full" />}
    </motion.div>
  );
});

Node.displayName = 'Node';