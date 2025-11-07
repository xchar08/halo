import { createClient } from 'redis';
import { Article, ArticleFilters } from '@/types';

let client: any = null;

async function getRedisClient() {
  if (!client) {
    try {
      client = createClient({
        url: process.env.REDIS_URL,
      });
      await client.connect();
      console.log('✅ Redis connected');
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      throw error;
    }
  }
  return client;
}

export class Database {
  async getArticles(filters: ArticleFilters = {}) {
    try {
      const redis = await getRedisClient();
      let data = await redis.get('articles');
      let articles: Article[] = data ? JSON.parse(data) : [];

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

      articles.sort((a, b) => 
        new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()
      );

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
      console.error('❌ Error reading articles:', error);
      return { articles: [], total: 0, page: 1, limit: 20 };
    }
  }

  async saveArticles(articles: Article[]) {
    try {
      const redis = await getRedisClient();
      
      const uniqueArticles: Article[] = [];
      const seenLinks = new Set<string>();

      articles.forEach((article) => {
        if (!seenLinks.has(article.link)) {
          seenLinks.add(article.link);
          uniqueArticles.push(article);
        }
      });

      const sorted = uniqueArticles.sort(
        (a, b) => new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()
      );
      const limited = sorted.slice(0, 1000);

      await redis.setEx('articles', 30 * 24 * 60 * 60, JSON.stringify(limited));
      console.log(`✅ Saved ${limited.length} articles to Redis`);
    } catch (error) {
      console.error('❌ Error saving articles:', error);
    }
  }

  async getStats() {
    try {
      const redis = await getRedisClient();
      let data = await redis.get('articles');
      const articles: Article[] = data ? JSON.parse(data) : [];

      return {
        totalArticles: articles.length,
        sources: [...new Set(articles.map((a) => a.sourceName))].length,
        categories: [...new Set(articles.map((a) => a.category))].length,
        lastUpdated: articles.length > 0 ? articles[0].scrapedAt : null,
      };
    } catch (error) {
      console.error('❌ Error getting stats:', error);
      return { totalArticles: 0, sources: 0, categories: 0, lastUpdated: null };
    }
  }
}
