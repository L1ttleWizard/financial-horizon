import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

// Function to handle session login (create cookie)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      return new NextResponse(JSON.stringify({ error: 'ID token is required' }), { status: 400 });
    }

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const options = {
      name: 'firebase-session', // Must match the name in middleware
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    const response = new NextResponse(JSON.stringify({ status: 'success' }), {
      status: 200,
    });

    response.cookies.set(options);

    return response;

  } catch (error) {
    console.error('Session POST Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// Function to handle session logout (delete cookie)
export async function DELETE() {
  try {
    const options = {
      name: 'firebase-session',
      value: '',
      maxAge: -1, // Expire the cookie immediately
      path: '/',
    };

    const response = new NextResponse(JSON.stringify({ status: 'success' }), {
      status: 200,
    });

    response.cookies.set(options);

    return response;

  } catch (error) {
    console.error('Session DELETE Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
  