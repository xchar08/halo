"use client";

import { useEffect, useRef } from "react";
import { Cosmograph, CosmographRef } from "@cosmograph/react";
import { useGraphStore } from "@/store/graph-store";
import { GraphNode, GraphEdge } from "@/types/graph";

export default function CosmographWrapper() {
  const cosmographRef = useRef<CosmographRef<GraphNode, GraphEdge>>(null);
  
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const isPaused = useGraphStore((state) => state.isPaused);
  const resetTrigger = useGraphStore((state) => state.resetTrigger);

  // 1. Handle Pause/Play
  useEffect(() => {
    if (!cosmographRef.current) return;
    if (isPaused) cosmographRef.current.pause();
    else cosmographRef.current.restart();
  }, [isPaused]);

  // 2. Handle Reset
  useEffect(() => {
    if (cosmographRef.current && resetTrigger > 0) {
        cosmographRef.current.fitView();
        cosmographRef.current.unselectNodes();
        setSelectedNode(null);
    }
  }, [resetTrigger, setSelectedNode]);

  // 3. Initial Fit
  useEffect(() => {
    if (nodes.length > 0 && cosmographRef.current) {
        setTimeout(() => { cosmographRef.current?.fitView(); }, 1000);
    }
  }, [nodes.length]);

  return (
    <div className="h-full w-full bg-black cursor-crosshair">
      <Cosmograph
        ref={cosmographRef}
        nodes={nodes}
        links={edges}
        
        backgroundColor="#000000"
        
        // --- DYNAMIC COLORING (The "Brain" Visuals) ---
        nodeColor={(n) => {
            const data = n.data as any;
            const meta = data?.metadata || {};
            const category = meta.category;
            const tags = meta.tags || [];

            // A. Knowledge Base Categories (Highest Priority)
            if (category === 'industry') return "#ef4444"; // Red (Corporate)
            if (category === 'university') return "#10b981"; // Green (Academic)
            if (category === 'government') return "#3b82f6"; // Blue (Official)
            if (category === 'startup') return "#a855f7"; // Purple (Innovation)
            if (category === 'github') return "#ffffff"; // White (Code)

            // B. Ontology Tags (Auto-Tagged)
            const tagStr = tags.join(" ").toLowerCase();
            if (tagStr.includes("llm") || tagStr.includes("transformer")) return "#f472b6"; // Pink
            if (tagStr.includes("vision") || tagStr.includes("image")) return "#60a5fa"; // Light Blue
            if (tagStr.includes("robotics") || tagStr.includes("agent")) return "#fb923c"; // Orange

            // C. Fallback Heuristics
            if (nodes.length > 0 && n.id === nodes[0].id) return "#fbbf24"; // Seed = Amber
            const score = data?.math_density_score || 0;
            if (score > 0.6) return "#facc15"; // High Math = Gold
            
            return "#22d3ee"; // Default = Cyan
        }}
        
        nodeLabelAccessor={(n) => n.label}
        nodeLabelColor="#94a3b8"
        showDynamicLabels={true} 
        nodeSize={(n) => (n.radius || 4) * 1.2} 
        linkWidth={1.5}
        linkColor={(l) => "#334155"}
        linkArrows={false}
        
        simulationRepulsion={1.5}     
        simulationGravity={0.1}       
        simulationLinkSpring={0.4}    
        simulationFriction={0.92}     
        
        onClick={(n) => {
            const nodeId = n ? n.id : null;
            setSelectedNode(nodeId);
            if (n) cosmographRef.current?.selectNodes([n]);
            else cosmographRef.current?.unselectNodes();
        }}
      />
    </div>
  );
}
