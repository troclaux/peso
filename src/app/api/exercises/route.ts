import { NextResponse } from 'next/server';
import { pool, auth } from '@/auth';

export const POST = auth(async function POST(req: Request) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO exercises (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
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
    const result = await pool.query('SELECT * FROM exercises ORDER BY name');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
  }
});
