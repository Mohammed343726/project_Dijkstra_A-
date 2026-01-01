import React from 'react';
import { useStore } from '../store/useStore';
import { Node } from './Node';

export const Grid: React.FC = () => {
  const { grid, handleMouseUp } = useStore();

  return (
    <div 
        className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10"
        onMouseLeave={handleMouseUp} // Stop drawing if mouse leaves grid
    >
      <div className="grid gap-[1px] bg-white/5 p-[1px]"> 
      {/* gap-[1px] creates the grid lines effect combined with background color */}
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((node, nodeIndex) => (
              <Node
                key={`${rowIndex}-${nodeIndex}`}
                row={node.row}
                col={node.col}
                type={node.type}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};