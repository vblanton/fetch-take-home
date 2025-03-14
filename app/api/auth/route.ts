import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, credentials } = body;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (action === 'login') {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': cookieHeader,
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error:', errorText);
        return NextResponse.json({ error: 'Login failed' }, { status: 401 });
      }

      // Forward the Set-Cookie header from the backend
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        const response = NextResponse.json({ success: true });
        response.headers.set('Set-Cookie', cookies);
        return response;
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'logout') {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': cookieHeader,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Logout error:', errorText);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
      }

      // Forward the Set-Cookie header from the backend
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        const response = NextResponse.json({ success: true });
        response.headers.set('Set-Cookie', cookies);
        return response;
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 