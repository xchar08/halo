"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { ResearchFeed } from "@/components/research/ResearchFeed";
import { GlobalFeed } from "@/components/research/GlobalFeed";
import { GraphControls } from "@/components/visualizer/GraphControls";
import { NodeDetailPanel } from "@/components/research/NodeDetailPanel"; 
import { ReportView } from "@/components/research/ReportView"; 
import { createEphemeralDatabase, HaloDatabase } from "@/lib/rxdb/db"; 
import { startSync } from "@/lib/rxdb/sync";
import { useGraphStore } from "@/store/graph-store";
import { getGraphSnapshot } from "@/app/actions/graph";
import { createClient } from "@/lib/supabase/client"; 
import { Activity, Globe } from "lucide-react";

const CosmographWrapper = dynamic(
  () => import("@/components/visualizer/CosmographWrapper"),
  { ssr: false, loading: () => <div className="bg-zinc-950 h-full w-full flex items-center justify-center text-zinc-500">Initializing Graph Engine...</div> }
);

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { setGraphData } = useGraphStore();
  const [activeTab, setActiveTab] = useState("graph"); 
  const [sidebarTab, setSidebarTab] = useState<"agent" | "global">("agent");

  // CRITICAL: Use a Ref to track initialization status synchronously
  const isInitializing = useRef(false);
  const dbRef = useRef<HaloDatabase | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const init = async () => {
      // STOP DOUBLE INIT: If already initializing or initialized, stop.
      if (isInitializing.current) return;
      isInitializing.current = true;

      try {
          console.log("Initializing Project Page...");
          
          // 1. Load Graph Data (Fast)
          const snapshot = await getGraphSnapshot(projectId);
          if (mounted) setGraphData(snapshot.nodes, snapshot.edges);

          // 2. Init DB (Once per mount)
          if (mounted && !dbRef.current) {
             const db = await createEphemeralDatabase();
             dbRef.current = db; // Store in ref, not state
             await startSync(db.documents, db.citations);
          }
      } catch (error) {
          console.error("Failed to init project page:", error);
      }
    };

    init();

    // Realtime Listener
    const channel = supabase.channel(`project-${projectId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'documents', filter: `project_id=eq.${projectId}` },
            () => getGraphSnapshot(projectId).then(s => mounted && setGraphData(s.nodes, s.edges))
        ).subscribe();

    return () => {
        mounted = false;
        supabase.removeChannel(channel);
        
        // Cleanup DB on unmount
        if (dbRef.current) {
            console.log("Destroying DB instance...");
            (dbRef.current as any).destroy();
            dbRef.current = null;
        }
        // Reset init flag so it can run again if user navigates back
        isInitializing.current = false;
    };
  }, [projectId, setGraphData]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Main Content */}
      <div className="flex-1 relative h-full flex flex-col">
        {/* Top Tabs */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-1 rounded-lg flex gap-1 shadow-xl">
                <button onClick={() => setActiveTab("graph")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "graph" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}>Graph View</button>
                <button onClick={() => setActiveTab("report")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "report" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}>Final Report</button>
            </div>
        </div>

        {/* Views */}
        <div className="flex-1 relative w-full h-full">
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'graph' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                <CosmographWrapper>
                    <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
                        <GraphControls />
                    </div>
                </CosmographWrapper>
                <NodeDetailPanel />
            </div>
            
            <div className={`absolute inset-0 bg-zinc-950 transition-opacity duration-300 ${activeTab === 'report' ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                <ReportView projectId={projectId} />
            </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-[400px] border-l border-zinc-800 bg-zinc-950/95 backdrop-blur z-30 flex flex-col h-full shadow-xl">
        <div className="p-2 border-b border-zinc-800 flex gap-1 bg-zinc-900/50">
            <button onClick={() => setSidebarTab("agent")} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-colors ${sidebarTab === 'agent' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Activity className="h-3.5 w-3.5" /> Agent Logs</button>
            <button onClick={() => setSidebarTab("global")} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-colors ${sidebarTab === 'global' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Globe className="h-3.5 w-3.5" /> Global Feed</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
            {sidebarTab === 'agent' ? <ResearchFeed /> : <GlobalFeed />}
        </div>
      </div>
    </div>
  );
}
