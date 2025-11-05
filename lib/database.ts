import { kv } from '@vercel/kv';
import { Article, ArticleFilters } from '@/types';

export class Database {
  async getArticles(filters: ArticleFilters = {}) {
    try {
      let articles: Article[] = await kv.get('articles') || [];

      // Apply filters
      if (filters.sourceId) {
        articles = articles.filter((a) => a.sourceId === filters.sourceId);
      }
      if (filters.category) {
        articles = articles.filter((a) => a.category === filters.category);
      }
      if (filters.region) {
        articles = articles.filter((a) => a.region === filters.region);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        articles = articles.filter(
          (a) =>
            a.title.toLowerCase().includes(query) ||
            a.description.toLowerCase().includes(query)
        );
      }

      // Sort by date
      articles.sort((a, b) => 
        new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()
      );

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const start = (page - 1) * limit;

      return {
        articles: articles.slice(start, start + limit),
        total: articles.length,
        page,
        limit,
      };
    } catch (error) {
      return { articles: [], total: 0, page: 1, limit: 20 };
    }
  }

  async saveArticles(articles: Article[]) {
    // Remove duplicates
    const uniqueArticles: Article[] = [];
    const seenLinks = new Set<string>();

    articles.forEach((article) => {
      if (!seenLinks.has(article.link)) {
        seenLinks.add(article.link);
        uniqueArticles.push(article);
      }
    });

    // Limit to recent 1000 articles
    const sorted = uniqueArticles.sort(
      (a, b) => new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()
    );
    const limited = sorted.slice(0, 1000);

    // Store in KV with 30-day expiration
    await kv.set('articles', limited, { ex: 60 * 60 * 24 * 30 });
  }

  async getStats() {
    try {
      const articles: Article[] = await kv.get('articles') || [];

      return {
        totalArticles: articles.length,
        sources: [...new Set(articles.map((a) => a.sourceName))].length,
        categories: [...new Set(articles.map((a) => a.category))].length,
        lastUpdated: articles.length > 0 ? articles[0].scrapedAt : null,
      };
    } catch (error) {
      return { totalArticles: 0, sources: 0, categories: 0, lastUpdated: null };
    }
  }
}
