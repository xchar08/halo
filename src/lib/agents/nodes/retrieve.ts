import { ResearchState, AgentLogEntry } from "@/types/agent";
import { firecrawl } from "@/lib/firecrawl";

/**
 * NODE: Retrieve Seed Papers
 * Performs a real web search using Firecrawl to find relevant academic/technical sources.
 */
export async function retrieveSeed(state: ResearchState): Promise<Partial<ResearchState>> {
  const query = state.query;
  console.log(`Executing search for: ${query}`);

  try {
    // 1. Execute Search via Firecrawl
    const searchResponse = await firecrawl.search(query, {
      limit: 3,
      scrapeOptions: { formats: ['markdown'] }
    });

    // --- ROBUST PARSING LOGIC ---
    let results: any[] = [];
    let raw: any = searchResponse;

    if (typeof raw === 'string') {
        try { raw = JSON.parse(raw); } catch (e) { console.error("Failed to parse string response", e); }
    }

    if (Array.isArray(raw)) {
        results = raw;
    } else if (raw && typeof raw === 'object') {
        if (Array.isArray(raw.data)) results = raw.data;
        else if (Array.isArray(raw.results)) results = raw.results;
        else if (raw.web) {
            if (Array.isArray(raw.web.results)) results = raw.web.results;
            else if (Array.isArray(raw.web.data)) results = raw.web.data;
            else if (Array.isArray(raw.web)) results = raw.web;
        }
    }

    console.log(`[Retrieve] Parsed ${results.length} results from Firecrawl.`);

    if (results.length === 0) {
       return {
           logs: [{
               timestamp: new Date().toISOString(),
               step: "retrieve_seed",
               message: "No search results found via Firecrawl."
           }]
       };
    }

    // 2. Map results to Seed Papers format with VALID UUIDs
    const newSeeds = results.map((result: any) => ({
      id: crypto.randomUUID(), // Generate valid UUID for DB
      title: result.title || "Untitled Source",
      url: result.url,
      snippet: result.markdown?.slice(0, 200) || result.description || "",
      link: result.url 
    }));

    // 3. Deduplicate against existing papers
    const existingIds = new Set((state.seedPapers || []).map((p: any) => p.id));
    const uniqueSeeds = newSeeds.filter((p: any) => !existingIds.has(p.id));

    const log: AgentLogEntry = {
      timestamp: new Date().toISOString(),
      step: "retrieve_seed",
      message: `Found ${uniqueSeeds.length} new papers via Firecrawl`,
      metadata: { sources: uniqueSeeds.map((s: any) => s.title) }
    };

    return {
      seedPapers: [...(state.seedPapers || []), ...uniqueSeeds],
      logs: [log]
    };

  } catch (error: any) {
    console.error("Search Error:", error);
    return {
      logs: [{
        timestamp: new Date().toISOString(),
        step: "retrieve_seed",
        message: `Search failed: ${error.message || "Unknown error"}`,
      }]
    };
  }
}
