"use server";

import { createClient } from "@/lib/supabase/server";
import { GraphNode, GraphEdge } from "@/types/graph";

export async function getGraphSnapshot(projectId: string) {
  console.log(`[Graph Snapshot] Fetching snapshot for Project: ${projectId}`);
  const supabase = await createClient();

  // 1. Fetch Documents (Nodes)
  // Fetch '*' to satisfy the full Document interface in GraphNode.data
  const { data: docs, error: docError } = await supabase
    .from("documents")
    .select("*") 
    .eq("project_id", projectId)
    .limit(1000);

  if (docError) {
      console.error("[Graph Snapshot] Failed to fetch documents:", docError);
      return { nodes: [], edges: [] };
  }

  console.log(`[Graph Snapshot] Found ${docs?.length || 0} documents.`);

  // 2. Fetch Citations (Edges)
  const { data: citations, error: citError } = await supabase
    .from("citations")
    .select("*")
    .limit(2000); 

  if (citError) {
      console.error("[Graph Snapshot] Failed to fetch citations:", citError);
  }

  // 3. Map to GraphNode Format
  const nodes: GraphNode[] = (docs || []).map((d) => ({
      id: d.id,
      label: d.title || "Untitled",
      radius: 10 + (d.math_density_score || 0) * 5, 
      color: d.source_type === 'arxiv' ? '#ef4444' : '#6366f1',
      // Cast 'd' to any if there are still minor mismatches (like optional fields vs null)
      // or ensure your local types match the DB exactly.
      data: d as any 
  }));

  // 4. Map to GraphEdge Format & Filter
  const validNodeIds = new Set(nodes.map(n => n.id));
  
  const edges: GraphEdge[] = (citations || [])
    .filter(c => validNodeIds.has(c.source_doc_id) && validNodeIds.has(c.target_doc_id))
    .map((c) => ({
      id: `${c.source_doc_id}_${c.target_doc_id}`,
      source: c.source_doc_id,
      target: c.target_doc_id,
      weight: c.weight || 1,
      type: c.citation_type || "semantic"
    }));

  console.log(`[Graph Snapshot] Returning ${nodes.length} nodes and ${edges.length} edges.`);

  return { nodes, edges };
}
