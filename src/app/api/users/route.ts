import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';

const SALT_ROUNDS = 10;

// how do i make a post request to create a single user?
// make a simple request

export async function POST(req: Request) {
  try {
    const { email, password, isAdmin } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const query = {
      text: `INSERT INTO users (id, email, hashed_password, is_admin, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           RETURNING id, email, is_admin, created_at`,
      values: [email, hashedPassword, isAdmin ?? false]
    };

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
