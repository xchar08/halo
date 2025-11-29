import { ResearchState, AgentLogEntry } from "@/types/agent";
import { firecrawl } from "@/lib/firecrawl";
import { createClient } from "@/lib/supabase/server";
import { GLOBAL_SOURCES } from "@/lib/knowledge-base/sources";

export async function monitorSources(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Agent] Monitoring Global Sources...");
  const logs: AgentLogEntry[] = [];
  const supabase = await createClient();
  const newFindings: any[] = [];

  // 1. FETCH SETTINGS
  const { data: project } = await supabase
    .from('projects')
    .select('settings')
    .eq('id', state.projectId)
    .single();

  const isDeep = project?.settings?.depth === 'deep';
  
  logs.push({ 
      step: "monitor", 
      message: `Running in ${isDeep ? "DEEP (All Sources)" : "STANDARD (Sampled)"} mode.`, 
      timestamp: new Date().toISOString() 
  });

  // 2. SELECT TARGETS
  let targets = [];
  if (isDeep) {
      targets = GLOBAL_SOURCES; // ALL sources
  } else {
      const startups = GLOBAL_SOURCES.filter(s => s.category === 'startup');
      const industry = GLOBAL_SOURCES.filter(s => s.category === 'industry');
      const unis = GLOBAL_SOURCES.filter(s => s.category === 'university');
      const githubs = GLOBAL_SOURCES.filter(s => s.category === 'github');
      const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
      targets = [pick(startups), pick(industry), pick(unis), pick(githubs)].filter(Boolean);
  }

  // 3. SCAN
  for (const source of targets) {
    try {
      // Safety brake for Deep Mode
      if (newFindings.length > 40) break; 

      logs.push({ step: "monitor", message: `Scanning ${source.name}...`, timestamp: new Date().toISOString() });

      // GITHUB STRATEGY
      if (source.category === 'github') {
          const scrape = await firecrawl.scrape(source.url);
          if (scrape && scrape.markdown) {
              newFindings.push({
                 id: crypto.randomUUID(),
                 project_id: state.projectId,
                 title: `${source.name} Update (GitHub)`,
                 url: source.url,
                 source_type: 'github',
                 content: scrape.markdown.slice(0, 1500),
                 metadata: { source_name: source.name, category: 'github', focus: source.focus }
              });
          }
          continue; 
      }

      // BLOG STRATEGY
      // Deep mode scans more pages (5 vs 2)
      const pageLimit = isDeep ? 5 : 2;
      
      const mapResult = await firecrawl.map(source.url, {
          search: "blog research paper release announcement",
          limit: pageLimit
      });

      let links: string[] = [];
      if (mapResult && typeof mapResult === 'object' && 'links' in mapResult) {
          links = (mapResult as any).links || [];
      } else if (Array.isArray(mapResult)) {
          links = mapResult;
      }

      // Deep mode takes more articles
      const articleLinks = links.filter(l => l.length > source.url.length + 5).slice(0, isDeep ? 3 : 1);

      for (const link of articleLinks) {
         const scrape = await firecrawl.scrape(link);
         if (scrape && scrape.markdown) {
             newFindings.push({
                 id: crypto.randomUUID(),
                 project_id: state.projectId,
                 title: scrape.metadata?.title || `Update from ${source.name}`,
                 url: link,
                 source_type: 'blog',
                 content: scrape.markdown.slice(0, 1000),
                 metadata: { 
                     source_name: source.name, 
                     institution: source.institution,
                     category: source.category,
                     focus: source.focus
                 }
             });
         }
         // Slight delay in deep mode to be polite
         if (isDeep) await new Promise(r => setTimeout(r, 500));
      }

    } catch (e: any) {
      console.error(`Failed to monitor ${source.name}:`, e.message);
    }
  }

  // BATCH INSERT
  if (newFindings.length > 0) {
      await supabase.from('documents').insert(newFindings);
      logs.push({ step: "monitor", message: `Ingested ${newFindings.length} new items.`, timestamp: new Date().toISOString() });
  }

  return { logs };
}
