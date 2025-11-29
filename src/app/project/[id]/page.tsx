"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { ResearchFeed } from "@/components/research/ResearchFeed";
import { GraphControls } from "@/components/visualizer/GraphControls";
import { NodeDetailPanel } from "@/components/research/NodeDetailPanel"; 
import { ReportView } from "@/components/research/ReportView"; // Ensure this is imported
import { getDatabase, HaloDatabase } from "@/lib/rxdb/db"; 
import { startSync } from "@/lib/rxdb/sync";
import { useGraphStore } from "@/store/graph-store";
import { getGraphSnapshot } from "@/app/actions/graph";
import { createClient } from "@/lib/supabase/client"; 

const CosmographWrapper = dynamic(
  () => import("@/components/visualizer/CosmographWrapper"),
  { ssr: false, loading: () => <div className="bg-zinc-950 h-full w-full flex items-center justify-center text-zinc-500">Initializing Graph Engine...</div> }
);

let dbInstance: HaloDatabase | null = null;

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { setGraphData } = useGraphStore();
  const [activeTab, setActiveTab] = useState("graph"); // TAB STATE

  useEffect(() => {
    let mounted = true;
    let rxSubscription: any = null;
    const supabase = createClient();

    const init = async () => {
      try {
          console.log("Initializing Project Page...");

          // 1. Initial Snapshot
          const snapshot = await getGraphSnapshot(projectId);
          if (mounted) {
              console.log(`Loaded snapshot: ${snapshot.nodes.length} nodes`);
              setGraphData(snapshot.nodes, snapshot.edges);
          }

          // 2. RxDB
          if (!dbInstance) {
             console.log("Creating RxDB Singleton...");
             dbInstance = await getDatabase();
             await startSync(dbInstance.documents, dbInstance.citations);
          }
      } catch (error) {
          console.error("Failed to init project page:", error);
      }
    };

    init();

    // 3. REALTIME REFRESH (Your working logic)
    const channel = supabase.channel(`project-${projectId}`)
        .on(
            'postgres_changes',
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'documents', 
                filter: `project_id=eq.${projectId}` 
            },
            (payload) => {
                console.log("Realtime: New Document Inserted!", payload);
                getGraphSnapshot(projectId).then(snapshot => {
                    if (mounted) {
                        console.log("Refreshed Graph from Realtime Event");
                        setGraphData(snapshot.nodes, snapshot.edges);
                    }
                });
            }
        )
        .subscribe();

    return () => {
        mounted = false;
        supabase.removeChannel(channel);
        if (rxSubscription?.unsubscribe) rxSubscription.unsubscribe();
    };
  }, [projectId, setGraphData]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-50">
      
      {/* Main Content Area */}
      <div className="flex-1 relative h-full flex flex-col">
        
        {/* Tab Navigation (Top Overlay) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-1 rounded-lg flex gap-1 shadow-xl">
                <button 
                    onClick={() => setActiveTab("graph")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        activeTab === "graph" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    Graph View
                </button>
                <button 
                    onClick={() => setActiveTab("report")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        activeTab === "report" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    Final Report
                </button>
            </div>
        </div>

        {/* View Container */}
        <div className="flex-1 relative w-full h-full">
            
            {/* 1. Graph View */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'graph' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                <CosmographWrapper />
                <div className="absolute bottom-4 left-4 z-20">
                    <GraphControls />
                </div>
                <NodeDetailPanel />
            </div>

            {/* 2. Report View */}
            <div className={`absolute inset-0 bg-zinc-950 transition-opacity duration-300 ${activeTab === 'report' ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                <ReportView projectId={projectId} />
            </div>

        </div>
      </div>

      {/* Sidebar (Right Panel) */}
      <div className="w-[400px] border-l border-zinc-800 bg-zinc-950/95 backdrop-blur z-30 flex flex-col h-full shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <div>
                <h1 className="font-bold text-lg text-zinc-100">Research Intelligence</h1>
                <p className="text-xs text-zinc-500">Realtime Graph & Agent Feed</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="System Active" />
        </div>
        <div className="flex-1 overflow-hidden">
            <ResearchFeed />
        </div>
      </div>
    </div>
  );
}
