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
