import { NextResponse } from 'next/server';
import { pool, auth } from '@/auth';

export const POST = auth(async function POST(req: Request) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, exercises } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json({ error: 'At least one exercise is required' }, { status: 400 });
    }

    await pool.query('BEGIN');

    const workoutResult = await pool.query(
      'INSERT INTO workouts (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [req.auth.userId, title, description || null]
    );

    const workout = workoutResult.rows[0];

    for (let i = 0; i < exercises.length; i++) {
      const { exercise_id, sets, reps } = exercises[i];
      await pool.query(
        'INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, order_number) VALUES ($1, $2, $3, $4, $5)',
        [workout.id, exercise_id, sets, reps, i + 1]
      );
    }

    await pool.query('COMMIT');

    return NextResponse.json(workout);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating workout:', error);
    return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 });
  }
});
