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

  // 1. Handle Pause/Play via Ref Methods
  useEffect(() => {
    if (!cosmographRef.current) return;
    
    if (isPaused) {
        cosmographRef.current.pause();
    } else {
        cosmographRef.current.restart();
    }
  }, [isPaused]);

  // 2. Handle Reset Trigger
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
        setTimeout(() => {
            cosmographRef.current?.fitView();
        }, 1000);
    }
  }, [nodes.length]);

  return (
    <div className="h-full w-full bg-black cursor-crosshair">
      <Cosmograph
        ref={cosmographRef}
        nodes={nodes}
        links={edges}
        
        // Remove the invalid prop 'isSimulationRunning'
        
        backgroundColor="#000000"
        nodeColor={(n) => {
            const score = n.data?.math_density_score || 0;
            if (nodes.length > 0 && n.id === nodes[0].id) return "#ffffff"; 
            if (score > 0.6) return "#facc15"; 
            return "#22d3ee"; 
        }}
        nodeLabelAccessor={(n) => n.label}
        nodeLabelColor="#94a3b8"
        showDynamicLabels={true} 
        nodeSize={(n) => (n.radius || 4) * 1.2} 
        linkWidth={1.5}
        linkColor={(l) => "#1e293b"}
        linkArrows={false}
        
        simulationRepulsion={1.2}     
        simulationGravity={0.15}      
        simulationLinkSpring={0.5}    
        simulationFriction={0.9}      
        
        onClick={(n) => {
            const nodeId = n ? n.id : null;
            setSelectedNode(nodeId);
            if (n) {
                console.log("Node Clicked:", n.label);
                cosmographRef.current?.selectNodes([n]);
            } else {
                console.log("Background Clicked (Deselect)");
                cosmographRef.current?.unselectNodes();
            }
        }}
      />
    </div>
  );
}
