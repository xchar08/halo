import OpenAI from 'openai';
import { env } from '@/lib/env';

/**
 * Nebius AI Configuration.
 * We use the OpenAI SDK as Nebius provides a compatible API endpoint.
 */

// Models available on Nebius Studio
export const NEBIUS_MODELS = {
  REASONING: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
  VISION: 'meta-llama/Llama-3.2-11B-Vision-Instruct',
  EMBEDDING: 'baai/bge-m3', // Or platform specific embedding model
} as const;

/**
 * Server-side only client for Nebius AI.
 * Do not use this in Client Components to avoid exposing the API Key.
 */
export const nebius = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: env.NEBIUS_API_KEY,
  maxRetries: 3,
});

/**
 * Helper to generate embeddings using Nebius/BAAI models.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await nebius.embeddings.create({
    model: NEBIUS_MODELS.EMBEDDING,
    input: text,
    encoding_format: 'float',
  });
  return response.data[0].embedding;
}
