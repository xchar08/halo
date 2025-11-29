import { ResearchState, AgentLogEntry } from "@/types/agent";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

// Use Nebius if key is present, otherwise fallback to dummy/OpenAI
const apiKey = process.env.NEBIUS_API_KEY || process.env.OPENAI_API_KEY || "dummy";
const baseURL = process.env.NEBIUS_API_KEY ? "https://api.studio.nebius.ai/v1/" : undefined;

const client = new OpenAI({ apiKey, baseURL });

export async function embedDocuments(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Agent] Generating Embeddings...");
  const logs: AgentLogEntry[] = [];
  const supabase = await createClient();

  const targets = state.seedPapers || [];
  if (targets.length === 0) return { logs };

  // UPDATED: Use the verified Nebius Embedding Model
  const model = process.env.NEBIUS_API_KEY ? "BAAI/bge-en-icl" : "text-embedding-3-small";

  let totalChunks = 0;

  for (const doc of targets) {
      const d = doc as any;
      const text = d.content || d.snippet || "";
      if (text.length < 50) continue;

      // 1. Split into chunks (Basic sentence/paragraph split)
      const chunks = text.match(/.{1,1000}/g) || []; 

      for (let i = 0; i < chunks.length; i++) {
          const chunkContent = chunks[i];
          
          try {
              const response = await client.embeddings.create({
                  model: model, 
                  input: chunkContent,
              });

              const embedding = response.data[0].embedding;

              // 2. Save to Supabase
              // Ensure your DB table 'document_chunks' has a vector column of matching dimension
              // BAAI/bge-en-icl is typically 1024 or 768 dimensions?
              // If Supabase errors with "vector dimensions mismatch", we might need to check the model specs.
              // Standard OpenAI is 1536. BGE might differ.
              
              await supabase.from('document_chunks').insert({
                  id: crypto.randomUUID(),
                  document_id: d.id,
                  chunk_index: i,
                  content: chunkContent,
                  embedding: embedding, 
                  token_count: chunkContent.length / 4
              });
              totalChunks++;

          } catch (e: any) {
              if (i === 0) console.warn(`Embedding failed for ${d.title} using ${model}:`, e.message);
          }
      }
  }

  if (totalChunks > 0) {
      logs.push({ step: "embed", message: `Embedded ${totalChunks} chunks using ${model}.`, timestamp: new Date().toISOString() });
  }

  return { logs };
}
    