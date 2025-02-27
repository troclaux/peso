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

export const DELETE = auth(async function DELETE(req: Request) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { exercise_id } = await req.json();

    if (!exercise_id) {
      return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      'DELETE FROM exercises WHERE id = $1 RETURNING *',
      [exercise_id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json({ error: 'Failed to delete exercise' }, { status: 500 });
  }
});

export const PUT = auth(async function PUT(req: Request) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { exercise_id, name, description } = await req.json();

    if (!exercise_id || !name) {
      return NextResponse.json({ error: 'Exercise ID and Name are required' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE exercises SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description || null, exercise_id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json({ error: 'Failed to update exercise' }, { status: 500 });
  }
});
