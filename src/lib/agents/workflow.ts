import { ResearchState } from "@/types/agent";
import { createClient } from "@/lib/supabase/server"; 
import { retrieveSeed } from "./nodes/retrieve";
import { expandGraph } from "./nodes/expand-graph";
import { extractMath } from "./nodes/math-ocr"; // Import Vision Node
import { synthesizeReport } from "./nodes/synthesize"; // Import Writing Node

export async function runResearchAgent(projectId: string) {
  console.log(`[Agent] Starting workflow for Project: ${projectId}`);
  
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error || !project) {
    throw new Error(`Project not found: ${projectId}`);
  }

  // Initialize State
  let state: ResearchState = {
    query: project.raw_spec,
    projectId: projectId, 
    project_id: projectId, 
    seedPapers: [],
    graph: { nodes: [], edges: [] },
    visitedUrls: new Set(),
    depth: 0,
    maxDepth: 2,
    logs: [],
    findings: [] 
  };

  await logStep(projectId, "init", `Initialized agent for query: ${state.query}`);

  try {
    // --- STEP 1: RETRIEVE ---
    state = await runStep(projectId, "retrieve_seed", retrieveSeed, state);

    // --- STEP 2: SAVE DOCS ---
    if (state.seedPapers.length > 0) {
        const papersToSave = state.seedPapers.map((p: any) => ({
            id: p.id,
            project_id: projectId,
            title: p.title,
            url: p.url || "", 
            content: p.content || p.snippet || "", 
            source_type: "web_search",
            math_density_score: 0.1
        }));
        await supabase.from("documents").upsert(papersToSave);
        await logStep(projectId, "save_docs", `Saved ${papersToSave.length} seed documents.`);
    }

    // --- STEP 3: MATH OCR ---
    state = await runStep(projectId, "math_ocr", extractMath, state);

    // --- STEP 4: EXPAND GRAPH ---
    state = await runStep(projectId, "expand_graph", expandGraph, state);

    // --- STEP 5: SYNTHESIZE REPORT ---
    state = await runStep(projectId, "synthesize", synthesizeReport, state);

    await logStep(projectId, "complete", "Workflow cycle completed.");

  } catch (err: any) {
    console.error("Agent Workflow Error:", err);
    await logStep(projectId, "error", `Workflow failed: ${err.message}`);
  }
}

// --- HELPERS ---

async function runStep(
    projectId: string, 
    stepName: string, 
    fn: (s: ResearchState) => Promise<Partial<ResearchState>>, 
    currentState: ResearchState
): Promise<ResearchState> {
    await logStep(projectId, stepName, `Starting ${stepName}...`);
    
    const result = await fn(currentState);
    const newState = { ...currentState, ...result };

    if (result.logs) {
        for (const log of result.logs) {
            await logStep(projectId, log.step, log.message, log.metadata);
        }
    }
    return newState;
}

async function logStep(projectId: string, step: string, message: string, metadata?: any) {
    const supabase = await createClient();
    await supabase.from("agent_logs").insert({
        project_id: projectId,
        step,
        message,
        metadata
    });
}
