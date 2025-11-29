import { ResearchState, AgentLogEntry } from "@/types/agent";
import OpenAI from "openai";

const nebius = new OpenAI({
    baseURL: "https://api.studio.nebius.ai/v1/",
    apiKey: process.env.NEBIUS_API_KEY || "dummy",
});

export async function extractMath(state: ResearchState): Promise<Partial<ResearchState>> {
  const seedPapers = state.seedPapers || [];
  const logs: AgentLogEntry[] = [];
  const targets = seedPapers.slice(0, 3); 

  for (const paper of targets) {
    // Use type assertion to access potential loose fields
    const p = paper as any;
    const imageUrl = p.ogImage || p.screenshot || p.image; 

    if (imageUrl && process.env.NEBIUS_API_KEY) {
      try {
        const response = await nebius.chat.completions.create({
          model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
          max_tokens: 512,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Transcribe any math equations in this image to LaTeX." },
                { type: "image_url", image_url: { url: imageUrl } }
              ]
            }
          ]
        });
        logs.push({
          timestamp: new Date().toISOString(),
          step: "math_ocr",
          message: `Vision processed: ${paper.title}`,
        });
      } catch (e) { console.error(e); }
    }
  }

  if (logs.length === 0) {
      logs.push({
          timestamp: new Date().toISOString(),
          step: "math_ocr",
          message: "No images found for Vision processing."
      });
  }

  return { logs };
}
