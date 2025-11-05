import axios from 'axios';
import { load } from 'cheerio';
import { Source, Article } from '@/types';

export class NewsScraper {
  public articles: Article[] = [];
  public errors: any[] = [];

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
              category: source.category,
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
