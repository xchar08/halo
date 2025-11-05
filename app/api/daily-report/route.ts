import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { ReportGenerator } from '@/lib/report-generator';

export const maxDuration = 60; // 1 minute timeout

export async function GET(request: NextRequest) {
  try {
    const db = new Database();
    const generator = new ReportGenerator();

    // Get today's articles
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await db.getArticles({ limit: 1000 });
    const todayArticles = result.articles.filter(
      (a) => new Date(a.scrapedAt) >= today
    );

    if (!todayArticles.length) {
      return NextResponse.json({
        date: today.toISOString().split('T')[0],
        summary: 'No research published today.',
        articles: [],
        isBigNews: false,
        articleCount: 0,
      });
    }

    const report = await generator.generateDailyReport(todayArticles);

    return NextResponse.json({
      ...report,
      articleCount: todayArticles.length,
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
