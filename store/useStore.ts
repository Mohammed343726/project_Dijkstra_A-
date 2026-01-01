import { create } from 'zustand';
import { AlgorithmType, GridState, NodeData, NodeType } from '../types';
import { ROWS, COLS, DEFAULT_START_NODE, DEFAULT_END_NODE, SPEEDS } from '../constants';
import * as algorithms from '../services/algorithmService';

interface StoreActions {
  setAlgorithm: (algo: AlgorithmType) => void;
  setSpeed: (speed: number) => void;
  resetGrid: () => void;
  clearPath: () => void;
  handleMouseDown: (row: number, col: number) => void;
  handleMouseEnter: (row: number, col: number) => void;
  handleMouseUp: () => void;
  runAlgorithm: () => Promise<void>;
  generateMaze: () => void;
}

const createNode = (row: number, col: number): NodeData => ({
  row,
  col,
  type: NodeType.EMPTY,
  distance: Infinity,
  isVisited: false,
  isWall: false,
  previousNode: null,
  weight: 1,
  f: Infinity,
  g: Infinity,
  h: Infinity
});

const getInitialGrid = (): NodeData[][] => {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
      const node = createNode(row, col);
      if (row === DEFAULT_START_NODE.row && col === DEFAULT_START_NODE.col) {
        node.type = NodeType.START;
        node.distance = 0;
      }
      if (row === DEFAULT_END_NODE.row && col === DEFAULT_END_NODE.col) {
        node.type = NodeType.END;
      }
      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
};

// Helper to safely toggle wall without mutating state directly improperly
const getNewGridWithWallToggled = (grid: NodeData[][], row: number, col: number) => {
  const newGrid = grid.slice(); // shallow copy outer array
  const node = newGrid[row][col];
  if (node.type === NodeType.START || node.type === NodeType.END) return newGrid;
  
  newGrid[row] = [...newGrid[row]]; // shallow copy the row
  const newNode = {
    ...node,
    isWall: !node.isWall,
    type: !node.isWall ? NodeType.WALL : NodeType.EMPTY,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export const useStore = create<GridState & StoreActions>((set, get) => ({
  grid: getInitialGrid(),
  isMousePressed: false,
  nodeTypeBeingDragged: null,
  isRunning: false,
  isFinished: false,
  startNode: DEFAULT_START_NODE,
  endNode: DEFAULT_END_NODE,
  selectedAlgorithm: AlgorithmType.DIJKSTRA,
  speed: SPEEDS.FAST,
  stats: {
    visitedCount: 0,
    pathLength: 0,
    timeElapsed: 0,
  },

  setAlgorithm: (algo) => set({ selectedAlgorithm: algo }),
  setSpeed: (speed) => set({ speed }),

  resetGrid: () => {
    // Completely reset to initial state
    set({
      grid: getInitialGrid(),
      isFinished: false,
      isRunning: false,
      startNode: DEFAULT_START_NODE,
      endNode: DEFAULT_END_NODE,
      stats: { visitedCount: 0, pathLength: 0, timeElapsed: 0 }
    });
  },

  clearPath: () => {
    const { grid } = get();
    const newGrid = grid.map(row => row.map(node => {
        // Keep walls, start, end. Reset visited, path, distance
        const newNode = { ...node };
        newNode.isVisited = false;
        newNode.distance = Infinity;
        newNode.previousNode = null;
        newNode.f = Infinity;
        newNode.g = Infinity;
        newNode.h = Infinity;
        if (newNode.type === NodeType.VISITED || newNode.type === NodeType.PATH) {
            newNode.type = NodeType.EMPTY;
        }
        // Restore start/end types if they were covered
        if (newNode.row === get().startNode.row && newNode.col === get().startNode.col) {
             newNode.type = NodeType.START;
             newNode.distance = 0;
        }
        if (newNode.row === get().endNode.row && newNode.col === get().endNode.col) {
             newNode.type = NodeType.END;
        }
        return newNode;
    }));
    set({ grid: newGrid, isFinished: false, stats: { visitedCount: 0, pathLength: 0, timeElapsed: 0 } });
  },

  handleMouseDown: (row, col) => {
    if (get().isRunning) return;
    const { grid } = get();
    const node = grid[row][col];

    if (node.type === NodeType.START) {
        set({ nodeTypeBeingDragged: NodeType.START, isMousePressed: true });
    } else if (node.type === NodeType.END) {
        set({ nodeTypeBeingDragged: NodeType.END, isMousePressed: true });
    } else {
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        set({ grid: newGrid, isMousePressed: true, nodeTypeBeingDragged: null });
    }
  },

  handleMouseEnter: (row, col) => {
    const { isMousePressed, isRunning, nodeTypeBeingDragged, startNode, endNode, grid } = get();
    if (!isMousePressed || isRunning) return;

    // Logic for dragging START node
    if (nodeTypeBeingDragged === NodeType.START) {
        if (row === endNode.row && col === endNode.col) return; // Cannot place on top of End
        if (row === startNode.row && col === startNode.col) return; // No change

        const newGrid = grid.slice();
        
        // Clear old start
        newGrid[startNode.row] = [...newGrid[startNode.row]];
        newGrid[startNode.row][startNode.col] = {
            ...newGrid[startNode.row][startNode.col],
            type: NodeType.EMPTY,
            distance: Infinity,
            isWall: false
        };

        // Set new start
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = {
            ...newGrid[row][col],
            type: NodeType.START,
            distance: 0,
            isWall: false
        };

        set({ grid: newGrid, startNode: { row, col } });
    }
    // Logic for dragging END node
    else if (nodeTypeBeingDragged === NodeType.END) {
        if (row === startNode.row && col === startNode.col) return; // Cannot place on top of Start
        if (row === endNode.row && col === endNode.col) return; // No change

        const newGrid = grid.slice();

        // Clear old end
        newGrid[endNode.row] = [...newGrid[endNode.row]];
        newGrid[endNode.row][endNode.col] = {
            ...newGrid[endNode.row][endNode.col],
            type: NodeType.EMPTY,
            isWall: false
        };

        // Set new end
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = {
            ...newGrid[row][col],
            type: NodeType.END,
            isWall: false
        };

        set({ grid: newGrid, endNode: { row, col } });
    }
    // Logic for drawing WALLS
    else {
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        set({ grid: newGrid });
    }
  },

  handleMouseUp: () => set({ isMousePressed: false, nodeTypeBeingDragged: null }),

  generateMaze: () => {
      if (get().isRunning) return;
      get().clearPath();
      const { grid, startNode, endNode } = get();
      const newGrid = grid.map(row => row.map(node => {
          if ((node.row === startNode.row && node.col === startNode.col) || 
              (node.row === endNode.row && node.col === endNode.col)) {
              return node;
          }
          return {
              ...node,
              isWall: Math.random() < 0.3, // 30% chance of wall
              type: Math.random() < 0.3 ? NodeType.WALL : NodeType.EMPTY
          };
      }));
      set({ grid: newGrid });
  },

  runAlgorithm: async () => {
    const { grid, selectedAlgorithm, startNode, endNode, speed } = get();
    if (get().isRunning) return;
    
    // Clear previous path first
    get().clearPath();
    
    set({ isRunning: true });
    
    const startTime = performance.now();
    
    // Deep copy grid for algorithm calc to not mutate state directly yet
    const currentGrid = get().grid.map(row => row.map(n => ({...n}))); 
    const start = currentGrid[startNode.row][startNode.col];
    const end = currentGrid[endNode.row][endNode.col];

    let result;
    switch (selectedAlgorithm) {
        case AlgorithmType.DIJKSTRA:
            result = algorithms.dijkstra(currentGrid, start, end);
            break;
        case AlgorithmType.BFS:
            result = algorithms.bfs(currentGrid, start, end);
            break;
        case AlgorithmType.DFS:
            result = algorithms.dfs(currentGrid, start, end);
            break;
        case AlgorithmType.ASTAR:
            result = algorithms.aStar(currentGrid, start, end);
            break;
        default:
            result = algorithms.dijkstra(currentGrid, start, end);
    }
    
    const endTime = performance.now();
    const timeElapsed = endTime - startTime;

    const { visitedNodesInOrder, shortestPath } = result;

    // Animation Loop
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            // Finished visiting, animate path
            if (shortestPath.length > 0) {
                 await animatePath(shortestPath, speed);
            }
            set({ 
                isRunning: false, 
                isFinished: true,
                stats: {
                    visitedCount: visitedNodesInOrder.length,
                    pathLength: shortestPath.length,
                    timeElapsed: parseFloat(timeElapsed.toFixed(2))
                }
            });
            return;
        }

        const node = visitedNodesInOrder[i];
        if(!node) continue;
        
        set((state) => {
            const newGrid = state.grid.slice();
            const stateNode = newGrid[node.row][node.col];
            // Ensure we don't overwrite start/end visually
            if (stateNode.type !== NodeType.START && stateNode.type !== NodeType.END) {
                 newGrid[node.row] = [...newGrid[node.row]];
                 const newNode = { ...stateNode, type: NodeType.VISITED, isVisited: true };
                 newGrid[node.row][node.col] = newNode;
                 return { grid: newGrid };
            }
            return {};
        });

        if (speed > 0) await new Promise(r => setTimeout(r, speed));
    }
  },
}));

const animatePath = async (shortestPathNodes: NodeData[], speed: number) => {
    for (let i = 0; i < shortestPathNodes.length; i++) {
        const node = shortestPathNodes[i];
        useStore.setState((state) => {
             const newGrid = state.grid.slice();
             const stateNode = newGrid[node.row][node.col];
             if (stateNode.type !== NodeType.START && stateNode.type !== NodeType.END) {
                 newGrid[node.row] = [...newGrid[node.row]];
                 const newNode = { ...stateNode, type: NodeType.PATH, isPath: true };
                 newGrid[node.row][node.col] = newNode;
                 return { grid: newGrid };
             }
             return {};
        });
        if (speed > 0) await new Promise(r => setTimeout(r, speed * 2)); // Path animation slightly slower/distinct
    }
};