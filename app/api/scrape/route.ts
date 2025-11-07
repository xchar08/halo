import { NextRequest, NextResponse } from 'next/server';
import { NewsScraper } from '@/lib/scraper';
import { Database } from '@/lib/database';
import labsConfig from '@/lib/labs.json';

export const maxDuration = 300; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting scraper...');

    const scraper = new NewsScraper();
    const db = new Database();

    console.log(`📡 Scraping ${labsConfig.sources.length} sources...`);
    const articles = await scraper.scrapeAll(labsConfig.sources);

    console.log(`✅ Scraped ${articles.length} articles`);

    if (articles.length > 0) {
      await db.saveArticles(articles);
      console.log('💾 Articles saved to Redis');
    } else {
      console.warn('⚠️ No articles scraped');
    }

    const stats = await db.getStats();
    console.log('📊 Stats:', stats);

    await scraper.close();

    return NextResponse.json({
      success: true,
      articlesScrapped: articles.length,
      errors: scraper.errors.length,
      stats,
      message: `Successfully scraped ${articles.length} articles from ${labsConfig.sources.length} sources`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Scraper error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST to /api/scrape to start scraping',
    example: 'curl -X POST https://your-domain.vercel.app/api/scrape',
  });
}
