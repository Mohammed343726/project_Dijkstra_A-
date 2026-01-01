import { NodeData, NodeType } from '../types';

// Helpers
const getNeighbors = (node: NodeData, grid: NodeData[][]) => {
  const neighbors: NodeData[] = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
};

const getAllNodes = (grid: NodeData[][]) => {
  const nodes: NodeData[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

const getNodesInShortestPathOrder = (finishNode: NodeData) => {
  const nodesInShortestPathOrder: NodeData[] = [];
  let currentNode: NodeData | null = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
};

// --- Algorithms ---

export const dijkstra = (grid: NodeData[][], startNode: NodeData, finishNode: NodeData) => {
  const visitedNodesInOrder: NodeData[] = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (!closestNode) break;

    // If we encounter a wall, we skip it
    if (closestNode.isWall) continue;

    // If the closest node is at a distance of infinity, we must be trapped and should stop
    if (closestNode.distance === Infinity) return { visitedNodesInOrder, shortestPath: [] };

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) {
      return { visitedNodesInOrder, shortestPath: getNodesInShortestPathOrder(finishNode) };
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }
  return { visitedNodesInOrder, shortestPath: [] };
};

const sortNodesByDistance = (unvisitedNodes: NodeData[]) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

const updateUnvisitedNeighbors = (node: NodeData, grid: NodeData[][]) => {
  const neighbors = getNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

export const bfs = (grid: NodeData[][], startNode: NodeData, finishNode: NodeData) => {
    const visitedNodesInOrder: NodeData[] = [];
    const queue: NodeData[] = [startNode];
    startNode.isVisited = true;
    
    while(queue.length) {
        const currentNode = queue.shift();
        if(!currentNode) break;
        
        if (currentNode.isWall) continue;
        
        visitedNodesInOrder.push(currentNode);
        
        if (currentNode === finishNode) {
            return { visitedNodesInOrder, shortestPath: getNodesInShortestPathOrder(finishNode) };
        }
        
        const neighbors = getNeighbors(currentNode, grid); // getNeighbors filters visited
        // For BFS, we mark visited immediately when adding to queue to avoid dupes
        // Note: My getNeighbors implementation filters !isVisited. 
        // We need to handle 'neighbors' carefully for BFS.
        
        // Let's manually get neighbors to control 'visited' logic for BFS
        const {row, col} = currentNode;
        const potentialNeighbors = [];
        if (row > 0) potentialNeighbors.push(grid[row - 1][col]);
        if (row < grid.length - 1) potentialNeighbors.push(grid[row + 1][col]);
        if (col > 0) potentialNeighbors.push(grid[row][col - 1]);
        if (col < grid[0].length - 1) potentialNeighbors.push(grid[row][col + 1]);

        for(const neighbor of potentialNeighbors) {
            if(!neighbor.isVisited && !neighbor.isWall) {
                neighbor.isVisited = true;
                neighbor.previousNode = currentNode;
                queue.push(neighbor);
            }
        }
    }
    return { visitedNodesInOrder, shortestPath: [] };
}

export const dfs = (grid: NodeData[][], startNode: NodeData, finishNode: NodeData) => {
    const visitedNodesInOrder: NodeData[] = [];
    const stack: NodeData[] = [startNode];
    
    // Reset visited for DFS? The grid is fresh when we call this.
    
    while(stack.length) {
        const currentNode = stack.pop();
        if(!currentNode) break;
        
        if(currentNode.isVisited) continue;
        if(currentNode.isWall) continue;
        
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        
        if(currentNode === finishNode) {
            return { visitedNodesInOrder, shortestPath: getNodesInShortestPathOrder(finishNode) };
        }
        
        // Push neighbors
        const {row, col} = currentNode;
        const potentialNeighbors = [];
        // Order matters for DFS visual shape. Top, Right, Bottom, Left usually.
        if (row > 0) potentialNeighbors.push(grid[row - 1][col]); // Top
        if (col < grid[0].length - 1) potentialNeighbors.push(grid[row][col + 1]); // Right
        if (row < grid.length - 1) potentialNeighbors.push(grid[row + 1][col]); // Bottom
        if (col > 0) potentialNeighbors.push(grid[row][col - 1]); // Left
        
        for(const neighbor of potentialNeighbors) {
             if(!neighbor.isVisited && !neighbor.isWall) {
                 neighbor.previousNode = currentNode;
                 stack.push(neighbor);
             }
        }
    }
    return { visitedNodesInOrder, shortestPath: [] };
}

export const aStar = (grid: NodeData[][], startNode: NodeData, finishNode: NodeData) => {
    const visitedNodesInOrder: NodeData[] = [];
    
    // Initialize
    startNode.g = 0;
    startNode.h = manhattanDistance(startNode, finishNode);
    startNode.f = startNode.g + startNode.h;
    
    const openSet: NodeData[] = [startNode];
    // We can use a property 'isInOpenSet' on NodeData to optimize, but array find is ok for small grid
    
    while(openSet.length > 0) {
        // Sort by F score
        openSet.sort((a,b) => a.f - b.f);
        const current = openSet.shift();
        
        if(!current) break;
        if(current.isWall) continue;
        
        current.isVisited = true;
        visitedNodesInOrder.push(current);
        
        if(current === finishNode) {
            return { visitedNodesInOrder, shortestPath: getNodesInShortestPathOrder(finishNode) };
        }
        
        const neighbors = [];
        const {row, col} = current;
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
        
        for(const neighbor of neighbors) {
            if(neighbor.isVisited || neighbor.isWall) continue;
            
            const tempG = current.g + 1; // Assuming weight 1
            
            // Check if neighbor is in openSet
            const inOpenSet = openSet.includes(neighbor);
            
            if (tempG < neighbor.g || !inOpenSet) {
                neighbor.g = tempG;
                neighbor.h = manhattanDistance(neighbor, finishNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previousNode = current;
                
                if(!inOpenSet) {
                    openSet.push(neighbor);
                }
            }
        }
    }
    return { visitedNodesInOrder, shortestPath: [] };
}

function manhattanDistance(nodeA: NodeData, nodeB: NodeData) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}
