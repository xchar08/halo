import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = new Database();

  try {
    const articleId = decodeURIComponent(params.id);
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
