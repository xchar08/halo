import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const region = searchParams.get('region');
    const sourceId = searchParams.get('sourceId');

    const db = new Database();

    // Build filters object
    const filters: any = {
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)),
    };

    if (category && category !== 'all') {
      filters.category = category;
    }

    if (search && search.trim()) {
      filters.search = search.trim();
    }

    if (region && region !== 'all') {
      filters.region = region;
    }

    if (sourceId && sourceId !== 'all') {
      filters.sourceId = sourceId;
    }

    // Fetch articles with filters
    const result = await db.getArticles(filters);

    return NextResponse.json({
      articles: result.articles || [],
      total: result.total || 0,
      page: result.page || 1,
      limit: result.limit || 20,
      hasMore: (result.page || 1) * (result.limit || 20) < (result.total || 0),
    });
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch articles',
        articles: [],
        total: 0,
        page: 1,
        limit: 20,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}
