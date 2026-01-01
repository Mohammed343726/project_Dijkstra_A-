export enum AlgorithmType {
  DIJKSTRA = 'Dijkstra',
  ASTAR = 'A* Search',
  BFS = 'Breadth First Search',
  DFS = 'Depth First Search',
}

export enum NodeType {
  EMPTY = 'EMPTY',
  WALL = 'WALL',
  START = 'START',
  END = 'END',
  VISITED = 'VISITED',
  PATH = 'PATH',
}

export interface NodeData {
  row: number;
  col: number;
  type: NodeType;
  distance: number;
  isVisited: boolean;
  isWall: boolean;
  previousNode: NodeData | null;
  weight: number; // For future weighted algos
  // A* specific
  f: number;
  g: number;
  h: number;
}

export interface GridState {
  grid: NodeData[][];
  isMousePressed: boolean;
  nodeTypeBeingDragged: NodeType | null; // Track if we are moving Start or End
  isRunning: boolean;
  isFinished: boolean;
  startNode: { row: number; col: number };
  endNode: { row: number; col: number };
  selectedAlgorithm: AlgorithmType;
  speed: number; // ms delay
  stats: {
    visitedCount: number;
    pathLength: number;
    timeElapsed: number;
  };
}