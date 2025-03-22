/**
 * @jest-environment node
 */

import { NextResponse } from 'next/server';
import { pool } from '@/auth';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation(() => ({}))
  },
}));

jest.mock('@/auth', () => ({
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [] }),
  },
  auth: jest.fn((handler) => handler),
}));

import { POST, GET } from '@/app/api/workouts/route';

describe('/api/workouts route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST handler', () => {
    it('returns 401 if not authenticated', async () => {
      const req = {
        auth: null,
        json: jest.fn().mockResolvedValue({
          title: 'Test Workout',
          exercises: []
        }),
      };

      await POST(req as unknown as Request);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    });

    it('creates a new workout with valid data', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { });

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, title: 'Test Workout' }],
      });

      const req = {
        auth: { userId: 123 },
        json: jest.fn().mockResolvedValue({
          title: 'Test Workout',
          description: 'Test Description',
          exercises: [{ exercise_id: 1, sets: 3, reps: 10 }]
        }),
      };

      await POST(req as unknown as Request);

      expect(pool.query).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalled();
    });
  });

  describe('GET handler', () => {
    it('returns workouts for authenticated user', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, title: 'Workout 1' }],
      });

      const req = {
        auth: { userId: 123 },
      };

      await GET(req as unknown as Request);

      expect(pool.query).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalled();
    });
  });
});
