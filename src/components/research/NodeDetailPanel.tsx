"use client";

import { useGraphStore } from "@/store/graph-store";
import { X, ExternalLink, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NodeDetailPanel() {
  const { nodes, selectedNodeId, setSelectedNode } = useGraphStore();
  
  // Find the full node object from the ID
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNodeId || !selectedNode) return null;

  // Type guard/cast for data (since we typed it as 'any' in graph store for speed)
  const doc = selectedNode.data as any;

  return (
    <div className="absolute top-4 right-4 w-[400px] h-[calc(100vh-32px)] bg-zinc-900/95 backdrop-blur border border-zinc-800 rounded-xl shadow-2xl z-50 flex flex-col animate-in slide-in-from-right-10 fade-in duration-200">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-start gap-2">
        <div className="flex-1">
            <Badge variant="outline" className="mb-2 bg-zinc-800 text-zinc-400 border-zinc-700">
                {doc.source_type || "Unknown Source"}
            </Badge>
            <h2 className="text-lg font-semibold text-zinc-100 leading-tight">
                {doc.title}
            </h2>
        </div>
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-zinc-500 hover:text-zinc-100"
            onClick={() => setSelectedNode(null)}
        >
            <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="h-4 w-4" />
                    <span>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                    <FileText className="h-4 w-4" />
                    <span>{Math.round((doc.math_density_score || 0) * 100)}% Math</span>
                </div>
            </div>

            {/* Snippet/Abstract */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">Abstract / Snippet</h3>
                <div className="p-3 bg-zinc-950 rounded-md border border-zinc-800 text-sm text-zinc-400 leading-relaxed font-mono">
                    {doc.content ? doc.content.slice(0, 500) + "..." : "No content available."}
                </div>
            </div>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
        {doc.url && (
            <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Read Full Source
                </a>
            </Button>
        )}
      </div>
    </div>
  );
}
