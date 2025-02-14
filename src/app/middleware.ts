
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {

  const token = request.cookies.get('accessToken')?.value;

  const isLoggedIn = !!token;

  const protectedRoutes = ['/workouts', '/users'];

  if (protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!isLoggedIn) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next(); // Allow the request to proceed
}
