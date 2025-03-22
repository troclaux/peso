import { NextResponse } from 'next/server';
import { pool, auth } from '@/auth';

export const POST = auth(async function POST(req: Request) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();
    const userId = req.auth.userId;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO exercises (name, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description || null, userId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 });
  }
});

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const userId = req.auth.userId;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT * FROM exercises WHERE user_id = $1 ORDER BY name',
      [userId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
  }
});
