import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';
import { Source, Article } from '@/types';

puppeteer.use(StealthPlugin());

export class NewsScraper {
  private browser: any = null;
  public articles: Article[] = [];
  public errors: any[] = [];

  async initialize() {
    const isProduction = process.env.VERCEL_ENV === 'production';

    this.browser = await puppeteer.launch({
      args: isProduction 
        ? chromium.args 
        : ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: isProduction 
        ? await chromium.executablePath() 
        : undefined,
      headless: true,
    });
  }

  async scrapeSource(source: Source): Promise<Article[]> {
    const page = await this.browser.newPage();

    try {
      await page.setDefaultTimeout(10000);
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      );

      console.log(`Scraping ${source.name}...`);
      await page.goto(source.url, { waitUntil: 'networkidle2', timeout: 15000 });

      await page.waitForSelector(source.newsSelector.container, {
        timeout: 5000,
      }).catch(() => console.log(`No container found for ${source.name}`));

      const articles = await page.evaluate((selector: any) => {
        const items = document.querySelectorAll(selector.container);
        const results: any[] = [];

        items.forEach((item: any) => {
          try {
            const titleEl = item.querySelector(selector.title);
            const descEl = item.querySelector(selector.description);
            const dateEl = item.querySelector(selector.date);
            const linkEl = item.querySelector(selector.link);
            const imgEl = item.querySelector(selector.image);

            const title = titleEl?.textContent?.trim() || '';
            const description = descEl?.textContent?.trim() || '';
            const date = dateEl?.textContent?.trim() || dateEl?.getAttribute('datetime') || '';
            const link = linkEl?.href || '';
            const image = imgEl?.src || imgEl?.getAttribute('data-src') || '';

            if (title && link) {
              results.push({ title, description, date, link, image });
            }
          } catch (e) {
            // Skip
          }
        });

        return results;
      }, source.newsSelector);

      return articles.map((article: any) => ({
        ...article,
        sourceId: source.id,
        sourceName: source.name,
        institution: source.institution,
        region: source.region,
        category: source.category,
        scrapedAt: new Date(),
      }));
    } catch (error: any) {
      console.error(`Error scraping ${source.name}:`, error.message);
      this.errors.push({
        source: source.name,
        error: error.message,
        timestamp: new Date(),
      });
      return [];
    } finally {
      await page.close();
    }
  }

  async scrapeAll(sources: Source[]): Promise<Article[]> {
    await this.initialize();
    this.articles = [];
    this.errors = [];

    for (const source of sources) {
      const articles = await this.scrapeSource(source);
      this.articles.push(...articles);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return this.articles;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
