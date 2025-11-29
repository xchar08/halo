import { create } from 'zustand';
import { GraphNode, GraphEdge } from '@/types/graph';

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  
  // Simulation Controls
  isPaused: boolean;
  resetTrigger: number; 

  setGraphData: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  setSelectedNode: (nodeId: string | null) => void;
  togglePause: () => void;
  setIsPaused: (paused: boolean) => void; // ADDED
  triggerReset: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isPaused: false,
  resetTrigger: 0,

  setGraphData: (nodes, edges) => set({ nodes, edges }),
  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setIsPaused: (paused) => set({ isPaused: paused }), // ADDED
  triggerReset: () => set((state) => ({ resetTrigger: state.resetTrigger + 1 })),
}));
