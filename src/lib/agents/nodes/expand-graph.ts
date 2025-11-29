import { ResearchState, AgentLogEntry } from "@/types/agent";
import { firecrawl } from "@/lib/firecrawl";
import { createClient } from "@/lib/supabase/server";

export async function expandGraph(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Agent] Expanding Graph...");
  
  if (!state.seedPapers || state.seedPapers.length === 0) {
      return { logs: [{ step: "expand_graph", message: "No seed papers to expand.", timestamp: new Date().toISOString() }] };
  }

  const supabase = await createClient();
  const newDocs: any[] = [];
  const newCitations: any[] = [];
  const logs: AgentLogEntry[] = [];

  // Pick the latest 2 seeds to expand
  const targets = state.seedPapers.slice(0, 2);

  for (const s of targets) {
      // FIX: Cast to any to access properties safely
      const seed = s as any; 

      try {
          // CLEAN THE TITLE
          let cleanTitle = (seed.title || "Untitled")
            .replace(/\(GitHub\)/i, "")
            .replace(/Update from/i, "")
            .replace(/Repo Update/i, "")
            .trim();

          // SMART QUERY GENERATION
          let query = "";
          if (seed.source_type === 'github') {
              query = `alternatives to ${cleanTitle} autonomous agents`;
          } else {
              query = `${cleanTitle} research methodology pdf`;
          }

          console.log(`[Expand] Searching for: ${query}`);

          const searchResponse = await firecrawl.search(query, {
              limit: 4, 
              scrapeOptions: { formats: ['markdown'] }
          });

          let results: any[] = [];
          let raw: any = searchResponse;
          if (typeof raw === 'string') try { raw = JSON.parse(raw); } catch(e){}
          
          if (Array.isArray(raw?.data)) results = raw.data;
          else if (Array.isArray(raw?.results)) results = raw.results;
          else if (raw?.web?.results) results = raw.web.results;

          for (const result of results) {
              if (!result.url || !result.title) continue;
              if (result.url === seed.url) continue;

              const newDocId = crypto.randomUUID();
              const isAcademic = result.url.includes('pdf') || result.url.includes('arxiv');

              newDocs.push({
                  id: newDocId,
                  project_id: state.projectId,
                  title: result.title,
                  url: result.url,
                  source_type: 'web_search', 
                  content: result.markdown?.slice(0, 1200) || result.description || "",
                  math_density_score: isAcademic ? 0.7 : 0.2,
                  created_at: new Date().toISOString()
              });

              newCitations.push({
                  source_doc_id: seed.id, 
                  target_doc_id: newDocId,
                  citation_type: 'semantic',
                  weight: 0.75
              });
          }

      } catch (error: any) {
          console.error(`Failed to expand seed: ${seed.title}`, error);
      }
  }

  if (newDocs.length > 0) {
      const { error: docError } = await supabase.from('documents').upsert(newDocs);
      if (!docError) {
          await supabase.from('citations').upsert(newCitations);
          logs.push({
              step: "expand_graph",
              message: `Expanded graph with ${newDocs.length} new nodes.`,
              timestamp: new Date().toISOString()
          });
      }
  } else {
      logs.push({ step: "expand_graph", message: "Search completed but found no new unique sources.", timestamp: new Date().toISOString() });
  }

  return { logs };
}
