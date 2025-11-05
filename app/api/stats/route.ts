import { NextResponse } from 'next/server';
import { Database } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = new Database();

  try {
    const stats = await db.getStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
