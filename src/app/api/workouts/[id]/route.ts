import { NextResponse } from 'next/server';
import { pool, auth } from '@/auth';

export const GET = auth(async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Workout ID is required' }, { status: 400 });
    }

    const workoutResult = await pool.query(
      'SELECT * FROM workouts WHERE id = $1 AND user_id = $2',
      [id, req.auth.userId]
    );

    if (workoutResult.rowCount === 0) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    const workout = workoutResult.rows[0];

    const exercisesResult = await pool.query(
      `SELECT we.id, we.sets, we.reps, we.order_number,
       e.id as exercise_id, e.name, e.description
       FROM workout_exercises we
       JOIN exercises e ON we.exercise_id = e.id
       WHERE we.workout_id = $1
       ORDER BY we.order_number`,
      [id]
    );

    workout.exercises = exercisesResult.rows;

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json({ error: 'Failed to fetch workout' }, { status: 500 });
  }
});

export const PUT = auth(async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { title, description, exercises } = await req.json();

    if (!id || !title) {
      return NextResponse.json({ error: 'Workout ID and Title are required' }, { status: 400 });
    }

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json({ error: 'At least one exercise is required' }, { status: 400 });
    }

    const checkResult = await pool.query(
      'SELECT * FROM workouts WHERE id = $1 AND user_id = $2',
      [id, req.auth.userId]
    );

    if (checkResult.rowCount === 0) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    await pool.query('BEGIN');

    const workoutResult = await pool.query(
      'UPDATE workouts SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, description || null, id]
    );

    await pool.query('DELETE FROM workout_exercises WHERE workout_id = $1', [id]);

    for (let i = 0; i < exercises.length; i++) {
      const { exercise_id, sets, reps } = exercises[i];
      await pool.query(
        'INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, order_number) VALUES ($1, $2, $3, $4, $5)',
        [id, exercise_id, sets, reps, i + 1]
      );
    }

    await pool.query('COMMIT');

    const workout = workoutResult.rows[0];
    return NextResponse.json(workout);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating workout:', error);
    return NextResponse.json({ error: 'Failed to update workout' }, { status: 500 });
  }
});
