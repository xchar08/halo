import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { ReportGenerator } from '@/lib/report-generator';

export const maxDuration = 120; // 2 minutes

export async function GET(request: NextRequest) {
  try {
    const db = new Database();
    const generator = new ReportGenerator();

    const result = await db.getArticles({ limit: 5000 });

    const reports = await generator.generateWeeklyReports(result.articles);

    return NextResponse.json({
      reports,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating weekly report:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
