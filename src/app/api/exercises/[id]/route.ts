import { NextResponse } from 'next/server';
import { pool, auth } from '@/auth';

export const DELETE = auth(async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const userId = req.auth.userId;

    if (!id) {
      return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Only delete exercise if it belongs to the current user
    const result = await pool.query(
      'DELETE FROM exercises WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Exercise not found or not authorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json({ error: 'Failed to delete exercise' }, { status: 500 });
  }
});

export const PUT = auth(async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { name, description } = await req.json();
    const userId = req.auth.userId;

    if (!id || !name) {
      return NextResponse.json({ error: 'Exercise ID and Name are required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Only update exercise if it belongs to the current user
    const result = await pool.query(
      'UPDATE exercises SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, description || null, id, userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Exercise not found or not authorized to update' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json({ error: 'Failed to update exercise' }, { status: 500 });
  }
});

export const GET = auth(async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const userId = req.auth.userId;

    if (!id) {
      return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Only fetch exercise if it belongs to the current user
    const result = await pool.query(
      'SELECT * FROM exercises WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Exercise not found or not authorized to access' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json({ error: 'Failed to fetch exercise' }, { status: 500 });
  }
});
