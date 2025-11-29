/**
 * Types specifically for the Visualizer and Graph Engine.
 * Optimized for Cosmograph and RxDB interaction.
 */

import { Document, Citation } from './research';

export interface GraphNode {
  id: string; // Maps to Document.id
  label: string; // Maps to Document.title
  radius: number; // Derived from citations count or math_density
  color: string; // Derived from source_type
  data: Document; // Full document payload for hover/details
}

export interface GraphEdge {
  id: string; // Usually `${source}_${target}`
  source: string; // Maps to source_doc_id
  target: string; // Maps to target_doc_id
  weight: number;
  type: Citation['citation_type'];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphState {
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  zoomLevel: number;
  isSimulating: boolean;
}
