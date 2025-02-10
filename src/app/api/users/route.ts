import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';

const SALT_ROUNDS = 10;

export async function POST(req: Request) {
  try {
    const { email, password, isAdmin } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createUserQuery = {
      text: `INSERT INTO users (id, email, hashed_password, is_admin, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           RETURNING id, email, is_admin, created_at`,
      values: [email, hashedPassword, isAdmin ?? false]
    };

    const client = await pool.connect(); // get a single database connection from the pool
    const result = await client.query(createUserQuery);
    client.release();   // Release the client back to the pool to free the connection to other requests

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
