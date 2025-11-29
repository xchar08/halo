import FirecrawlApp from '@mendable/firecrawl-js';
import { env } from '@/lib/env';

if (!env.FIRECRAWL_API_KEY) {
  throw new Error('FIRECRAWL_API_KEY is not defined');
}

export const firecrawl = new FirecrawlApp({
  apiKey: env.FIRECRAWL_API_KEY,
});

export interface ScrapeResult {
  content: string;
  metadata: {
    title?: string;
    description?: string;
    ogImage?: string;
    sourceURL?: string;
  };
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  try {
    const scrapeResponse = await firecrawl.scrape(url, {
      formats: ['markdown'],
    });

    // The SDK throws on error, or returns a valid object.
    // We check if 'markdown' exists to confirm success.
    if (!scrapeResponse || !scrapeResponse.markdown) {
         throw new Error('No content returned');
    }

    return {
      content: scrapeResponse.markdown || '',
      metadata: scrapeResponse.metadata || {},
    };
  } catch (error: any) {
    throw new Error(`Failed to scrape ${url}: ${error.message || error}`);
  }
}
