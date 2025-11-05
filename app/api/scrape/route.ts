import { NextResponse } from 'next/server';
import { NewsScraper } from '@/lib/scraper';
import { Database } from '@/lib/database';
import labsConfig from '@/lib/labs.json';

export const maxDuration = 300; // 5 minutes

export async function POST(request: Request) {
  try {
    // Optional: Add auth for security
    const authHeader = request.headers.get('authorization');
    if (process.env.SCRAPE_SECRET && authHeader !== `Bearer ${process.env.SCRAPE_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting scraper at', new Date().toISOString());

    const scraper = new NewsScraper();
    const db = new Database();

    const articles = await scraper.scrapeAll(labsConfig.sources);
    await db.saveArticles(articles);
    const stats = await db.getStats();

    await scraper.close();

    return NextResponse.json({
      success: true,
      articlesScraped: articles.length,
      errors: scraper.errors.length,
      stats,
      message: `Successfully scraped ${articles.length} articles from ${labsConfig.sources.length} sources`,
    });
  } catch (error: any) {
    console.error('Scraper error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: 'POST to /api/scrape to start scraping',
    example: 'curl -X POST https://your-domain.vercel.app/api/scrape',
  });
}
