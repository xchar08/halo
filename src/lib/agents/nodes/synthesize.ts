import { ResearchState, AgentLogEntry } from "@/types/agent";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

// Robust Client Initialization
const apiKey = process.env.NEBIUS_API_KEY || process.env.OPENAI_API_KEY;

// We confirmed this URL works for listing models
const baseURL = process.env.NEBIUS_API_KEY 
    ? "https://api.studio.nebius.ai/v1/" 
    : undefined; 

const llm = new OpenAI({
    baseURL,
    apiKey: apiKey || "dummy-key",
});

export async function synthesizeReport(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Agent] Synthesizing final report...");
  const logs: AgentLogEntry[] = [];

  try {
      // 1. Context Preparation
      const docs = state.seedPapers || [];
      if (docs.length === 0) {
          return { logs: [{ step: "synthesize", message: "No docs to synthesize.", timestamp: new Date().toISOString() }] };
      }

      // Cast 'd' to any to access content/snippet safely
      const context = docs.map((d, i) => {
          const doc = d as any;
          const content = doc.content || doc.snippet || "";
          return `[${i+1}] Title: ${doc.title}\nContent: ${content.slice(0, 1000)}`;
      }).join("\n\n");

      // 2. LLM Generation
      // UPDATED: Using Llama 3.3 which was confirmed to exist in the Nebius API
      const model = process.env.NEBIUS_API_KEY 
        ? "meta-llama/Llama-3.3-70B-Instruct" 
        : "gpt-4o"; 

      console.log(`[Agent] Using model: ${model} at ${baseURL || "OpenAI Default"}`);

      const prompt = `
      User Query: "${state.query}"
      
      Based on the papers below, write a concise research summary.
      - Use citations like [1], [2].
      - If math is present, use LaTeX format.
      - Use Markdown headers.
      
      Papers:
      ${context}
      `;

      const completion = await llm.chat.completions.create({
          model: model,
          messages: [
              { role: "system", content: "You are a helpful research assistant." },
              { role: "user", content: prompt }
          ],
          temperature: 0.3,
      });

      const report = completion.choices[0].message.content || "No report generated.";

      // 3. Save to DB
      const supabase = await createClient();
      await supabase.from("validation_reports").insert({
          project_id: state.projectId,
          status: "completed",
          summary_markdown: report,
          created_at: new Date().toISOString()
      });

      logs.push({
          step: "synthesize",
          message: "Generated final research report.",
          timestamp: new Date().toISOString()
      });

      return {
          logs,
          findings: [{ claimText: "Report Generated", verdict: "supported", confidence: 1.0, citations: [] }]
      };

  } catch (error: any) {
      console.error("Synthesis Error:", error);
      return {
          logs: [{ step: "synthesize", message: `Failed: ${error.message}`, timestamp: new Date().toISOString() }]
      };
  }
}
