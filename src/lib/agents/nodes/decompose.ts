import { ResearchState, AgentLogEntry } from "@/types/agent";
import { nebius, NEBIUS_MODELS } from "@/lib/nebius";

/**
 * NODE: Decompose Query
 * Transforms a high-level user research goal into specific search queries.
 */
export async function decomposeQuery(state: ResearchState): Promise<Partial<ResearchState>> {
  const { query } = state;

  const completion = await nebius.chat.completions.create({
    model: NEBIUS_MODELS.REASONING, // Llama 3.1 70B
    messages: [
      {
        role: "system",
        content: "You are a senior research scientist. Break down the user's research goal into 3-5 specific, keyword-heavy search queries suitable for academic databases (arXiv, Google Scholar)."
      },
      {
        role: "user",
        content: query
      }
    ],
    response_format: { type: "json_object" } 
  });

  // In a real app, we'd validate the JSON schema here
  const queries = JSON.parse(completion.choices[0].message.content || "{}").queries || [query];
  
  const log: AgentLogEntry = {
    timestamp: new Date().toISOString(),
    step: "decompose",
    message: `Generated ${queries.length} search queries`,
    metadata: { queries }
  };

  return {
    logs: [log]
  };
}
