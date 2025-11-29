import { z } from "zod";

const envSchema = z.object({
  // Public keys (Must exist on both Client & Server)
  NEXT_PUBLIC_APP_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  
  // Server-side keys (Optional on client, checked manually on server)
  // We use .optional() so the app doesn't crash when this runs in the browser
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEBIUS_API_KEY: z.string().optional(),
  FIRECRAWL_API_KEY: z.string().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEBIUS_API_KEY: process.env.NEBIUS_API_KEY,
  FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
});
