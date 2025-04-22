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
      const { exercise_id, sets, reps, load } = exercises[i];
      const workoutExerciseResult = await pool.query(
        'INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, order_number) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [workout.id, exercise_id, sets, reps, i + 1]
      );

      const workoutExerciseId = workoutExerciseResult.rows[0].id;

      await pool.query(
        'INSERT INTO exercise_loads (exercise_id, workout_exercise_id, user_id, load, set_number) VALUES ($1, $2, $3, $4, $5)',
        [exercise_id, workoutExerciseId, req.auth.userId, load || 0, 1]
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

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.auth.userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
});
