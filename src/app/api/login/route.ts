import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

const JWT_EXPIRES_IN = "50m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable must be set");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET environment variable must be set");
}

export async function POST(req: Request) {

  let client;

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {

    const { email, password } = body;

    // check if user exists
    client = await pool.connect();
    const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = result.rows[0];

    // compare passwords
    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // generate JWT access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // generate JWT refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    const saltRounds = 10;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);

    // store refresh token in database
    const refreshTokenQuery = {
      text: `
        INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '7 days')
        RETURNING *;
      `,
      values: [user.id, hashedRefreshToken]
    };

    // use transaction for atomicity
    await client.query("BEGIN");
    await client.query(refreshTokenQuery);
    await client.query("COMMIT");

    // send tokens in response
    const response = NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin,
      },
    });

    // Store refresh token in HTTP-only cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60, // Expires in 7 days
      path: "/", // Cookie is available across the entire site
    });

    console.log('Response:', response);

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}
