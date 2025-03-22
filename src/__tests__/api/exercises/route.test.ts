/**
 * @jest-environment node
 */

import { NextResponse } from 'next/server';
import { pool, auth } from '@/auth';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, options) => ({}))
  },
}));

jest.mock('@/auth', () => ({
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [] }),
  },
  auth: jest.fn((handler) => handler),
}));

import { POST, GET } from '@/app/api/exercises/route';

describe('/api/exercises route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST handler', () => {
    it('returns 401 if not authenticated', async () => {
      const req = {
        auth: null,
        json: jest.fn().mockResolvedValue({ name: 'Test Exercise' }),
      };

      await POST(req as any);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    });

    it('creates a new exercise with valid data', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, name: 'Test Exercise' }],
      });

      const req = {
        auth: { userId: 123 },
        json: jest.fn().mockResolvedValue({
          name: 'Test Exercise',
          description: 'Test Description'
        }),
      };

      await POST(req as any);

      expect(pool.query).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalled();
    });
  });

  describe('GET handler', () => {
    it('returns exercises for authenticated user', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, name: 'Exercise 1' }],
      });

      const req = {
        auth: { userId: 123 },
      };

      await GET(req as any);

      expect(pool.query).toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalled();
    });
  });
});
