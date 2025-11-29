import { ResearchState, AgentLogEntry } from "@/types/agent";
import { firecrawl } from "@/lib/firecrawl";
import { createClient } from "@/lib/supabase/server";

/**
 * NODE: Expand Graph (Graph RAG)
 * Performs a "Citation Walk":
 * 1. Takes existing Seed Papers.
 * 2. Searches for papers that cite them.
 * 3. Inserts these new papers (Nodes) and citations (Edges) into Supabase.
 */
export async function expandGraph(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Agent] Expanding Graph...");
  
  // Safety check
  if (!state.seedPapers || state.seedPapers.length === 0) {
      return {
          logs: [{ step: "expand_graph", message: "No seed papers to expand from.", timestamp: new Date().toISOString() }]
      };
  }

  const supabase = await createClient();
  const newDocs: any[] = [];
  const newCitations: any[] = [];
  const logs: AgentLogEntry[] = [];

  // Limit expansion to save API credits (top 2 seeds)
  const seedsToExpand = state.seedPapers.slice(0, 2);

  for (const seed of seedsToExpand) {
      try {
          // 1. Search for related work
          // SIMPLIFIED QUERY for better hit rate
          const query = `analysis of "${seed.title}"`; 
          
          const searchResponse = await firecrawl.search(query, {
              limit: 3, 
              scrapeOptions: { formats: ['markdown'] }
          });

          // Parse Firecrawl response
          let results: any[] = [];
          let raw: any = searchResponse;
          if (typeof raw === 'string') try { raw = JSON.parse(raw); } catch(e){}
          
          if (Array.isArray(raw?.data)) results = raw.data;
          else if (Array.isArray(raw?.results)) results = raw.results;
          else if (raw?.web?.results) results = raw.web.results;

          // 2. Process Results
          for (const result of results) {
              if (!result.url || !result.title) continue;
              
              // Skip if it's the same paper
              if (result.title === seed.title) continue;

              // Prepare new Document (Target)
              const newDocId = crypto.randomUUID();

              const newDoc = {
                  id: newDocId,
                  project_id: state.projectId,
                  title: result.title,
                  url: result.url,
                  source_type: 'web_search', 
                  content: result.markdown?.slice(0, 500) || result.description || "",
                  math_density_score: 0.2,
                  created_at: new Date().toISOString()
              };

              newDocs.push(newDoc);

              // Prepare Citation (Edge: Seed -> New Doc)
              const newCitation = {
                  source_doc_id: seed.id, 
                  target_doc_id: newDocId,
                  citation_type: 'semantic',
                  weight: 0.8
              };
              
              newCitations.push(newCitation);
          }

      } catch (error: any) {
          console.error(`Failed to expand seed: ${seed.title}`, error);
      }
  }

  // 3. Batch Insert to Supabase
  if (newDocs.length > 0) {
      // Insert Docs
      const { error: docError } = await supabase.from('documents').upsert(newDocs);
      if (docError) console.error("Doc Insert Error:", docError);

      // Insert Edges
      if (!docError) {
          const { error: citError } = await supabase.from('citations').upsert(newCitations);
          if (citError) console.error("Citation Insert Error:", citError);
      }
      
      logs.push({
          step: "expand_graph",
          message: `Expanded graph with ${newDocs.length} new nodes and ${newCitations.length} edges.`,
          timestamp: new Date().toISOString()
      });
  } else {
      logs.push({
          step: "expand_graph",
          message: "No new related papers found via search.",
          timestamp: new Date().toISOString()
      });
  }

  return { logs };
}
