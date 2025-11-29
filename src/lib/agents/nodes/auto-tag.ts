import { ResearchState, AgentLogEntry } from "@/types/agent";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const apiKey = process.env.NEBIUS_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = process.env.NEBIUS_API_KEY ? "https://api.studio.nebius.ai/v1/" : undefined;

const llm = new OpenAI({ apiKey: apiKey || "dummy", baseURL });

export async function autoTagDocuments(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Agent] Auto-tagging for Ontology...");
  const logs: AgentLogEntry[] = [];
  const supabase = await createClient();

  const docs = state.seedPapers || [];
  if (docs.length === 0) return { logs };

  // Limit to 10 titles to prevent context overflow
  const titles = docs.slice(0, 10).map(d => d.title).join("\n");

  try {
      const response = await llm.chat.completions.create({
          model: process.env.NEBIUS_API_KEY ? "meta-llama/Meta-Llama-3.1-70B-Instruct" : "gpt-4o",
          messages: [
              { role: "system", content: "Classify these papers into 1 specific technical tag (e.g. 'LLM', 'Vision', 'Robotics', 'Quantum'). Return JSON: { 'Title': 'Tag' }" },
              { role: "user", content: titles }
          ],
          response_format: { type: "json_object" }
      });

      const tagsMap = JSON.parse(response.choices[0].message.content || "{}");
      
      for (const doc of docs) {
          const tag = tagsMap[doc.title];
          if (tag) {
              // FIX: Cast to 'any' to handle loose metadata typing
              const d = doc as any;
              const newMeta = { ...(d.metadata || {}), tags: [tag] };
              await supabase.from('documents').update({ metadata: newMeta }).eq('id', d.id);
          }
      }
      
      logs.push({ step: "auto_tag", message: "Ontology tags applied to documents.", timestamp: new Date().toISOString() });

  } catch (e) {
      console.error("Auto-tag error:", e);
  }

  return { logs };
}
