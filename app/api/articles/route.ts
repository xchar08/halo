import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const db = new Database();

  try {
    const filters = {
      sourceId: searchParams.get('sourceId') || undefined,
      category: searchParams.get('category') || undefined,
      region: searchParams.get('region') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    const result = await db.getArticles(filters);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
