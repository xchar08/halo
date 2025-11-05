import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = new Database();

  try {
    const { id } = await params; // Await the params
    const articleId = decodeURIComponent(id);
    const result = await db.getArticles();
    const article = result.articles.find((a) => a.link === articleId);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
