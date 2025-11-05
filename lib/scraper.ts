import axios from 'axios';
import { load } from 'cheerio';
import { Source, Article } from '@/types';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'AI/ML': ['ai', 'machine learning', 'neural', 'algorithm', 'deep learning', 'model', 'training', 'inference', 'transformer'],
  'LLM/AGI': ['language model', 'llm', 'gpt', 'bert', 'llama', 'agi', 'reasoning', 'rlhf', 'prompt', 'fine-tune'],
  'Robotics': ['robot', 'robotic', 'manipulator', 'motion', 'control', 'autonomous vehicle', 'drone', 'rover', 'actuator'],
  'Physics': ['quantum', 'particle', 'physics', 'electron', 'photon', 'relativity', 'field', 'collision', 'energy'],
  'Biotech': ['gene', 'genetic', 'protein', 'biology', 'biotech', 'crispr', 'dna', 'rna', 'cell', 'organism'],
  'Safety': ['safety', 'alignment', 'robust', 'security', 'adversarial', 'verification', 'interpretability', 'explainability', 'fairness'],
  'Medical': ['medical', 'healthcare', 'diagnosis', 'treatment', 'drug', 'clinical', 'patient', 'disease', 'medicine', 'hospital'],
};

export class NewsScraper {
  public articles: Article[] = [];
  public errors: any[] = [];

  private extractCategory(source: Source, title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase();
    
    // Check keywords
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return category;
        }
      }
    }

    // Fallback to source category
    return source.category || 'AI/ML';
  }

  async scrapeSource(source: Source): Promise<Article[]> {
    try {
      console.log(`Scraping ${source.name}...`);
      
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 15000,
      });

      const $ = load(response.data);
      const containers = $(source.newsSelector.container);
      const articles: Article[] = [];

      containers.each((index, element) => {
        try {
          const titleEl = $(element).find(source.newsSelector.title).first();
          const descEl = $(element).find(source.newsSelector.description).first();
          const dateEl = $(element).find(source.newsSelector.date).first();
          const linkEl = $(element).find(source.newsSelector.link).first();
          const imgEl = $(element).find(source.newsSelector.image).first();

          const title = titleEl.text().trim();
          const description = descEl.text().trim();
          const date = dateEl.text().trim() || dateEl.attr('datetime') || '';
          const link = linkEl.attr('href') || '';
          const image = imgEl.attr('src') || imgEl.attr('data-src') || '';

          if (title && link) {
            const absoluteLink = link.startsWith('http') 
              ? link 
              : new URL(link, source.url).toString();

            // Auto-assign category based on content
            const autoCategory = this.extractCategory(source, title, description);

            articles.push({
              title,
              description,
              date,
              link: absoluteLink,
              image,
              sourceId: source.id,
              sourceName: source.name,
              institution: source.institution,
              region: source.region,
              category: autoCategory, // Use auto-detected category
              scrapedAt: new Date(),
            });
          }
        } catch (e) {
          // Skip individual items
        }
      });

      return articles;
    } catch (error: any) {
      console.error(`Error scraping ${source.name}:`, error.message);
      this.errors.push({
        source: source.name,
        error: error.message,
        timestamp: new Date(),
      });
      return [];
    }
  }

  async scrapeAll(sources: Source[]): Promise<Article[]> {
    this.articles = [];
    this.errors = [];

    for (const source of sources) {
      const articles = await this.scrapeSource(source);
      this.articles.push(...articles);
      // Slight delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return this.articles;
  }

  async close() {
    // No browser to close
  }
}
