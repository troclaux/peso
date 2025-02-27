import { NextResponse } from 'next/server';
import { pool, auth } from '@/auth';

export const DELETE = auth(async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      'DELETE FROM exercises WHERE id = $1 RETURNING *',
      [id]
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

export const PUT = auth(async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = params.id;
    const { name, description } = await req.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'Exercise ID and Name are required' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE exercises SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description || null, id]
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

export const GET = auth(async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
    }

    const result = await pool.query('SELECT * FROM exercises WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json({ error: 'Failed to fetch exercise' }, { status: 500 });
  }
});
