import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { useAuth } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  try {
      const { userId } = useAuth();
      if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      const body = await req.json();

      const stmt = db.prepare(
        'INSERT INTO CarConfigs (userId, carName, config, isShared) VALUES (?, ?, ?, ?)'
      );
      const result = stmt.run(userId, body.carName, JSON.stringify(body.config), body.isShared ? 1 : 0);
      return NextResponse.json(result, { status: 201 });
  } catch (err) {
      console.error(err);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
