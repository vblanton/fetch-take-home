import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (action === 'breeds') {
      const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': cookieHeader,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch breeds:', errorText);
        throw new Error('Failed to fetch breeds');
      }

      const data = await response.json();
      const responseHeaders = new Headers(response.headers);
      const setCookie = responseHeaders.get('set-cookie');
      
      const nextResponse = NextResponse.json(data);
      if (setCookie) {
        nextResponse.headers.set('Set-Cookie', setCookie);
      }
      return nextResponse;
    }

    if (action === 'search') {
      const response = await fetch(`${API_BASE_URL}/dogs/search?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': cookieHeader,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to search dogs:', errorText);
        throw new Error('Failed to search dogs');
      }

      const data = await response.json();
      const responseHeaders = new Headers(response.headers);
      const setCookie = responseHeaders.get('set-cookie');
      
      const nextResponse = NextResponse.json(data);
      if (setCookie) {
        nextResponse.headers.set('Set-Cookie', setCookie);
      }
      return nextResponse;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Dogs API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (action === 'fetch') {
      const response = await fetch(`${API_BASE_URL}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': cookieHeader,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch dog details:', errorText);
        throw new Error('Failed to fetch dog details');
      }

      const data = await response.json();
      const responseHeaders = new Headers(response.headers);
      const setCookie = responseHeaders.get('set-cookie');
      
      const nextResponse = NextResponse.json(data);
      if (setCookie) {
        nextResponse.headers.set('Set-Cookie', setCookie);
      }
      return nextResponse;
    }

    if (action === 'match') {
      const response = await fetch(`${API_BASE_URL}/dogs/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': cookieHeader,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to get match:', errorText);
        throw new Error('Failed to get match');
      }

      const data = await response.json();
      const responseHeaders = new Headers(response.headers);
      const setCookie = responseHeaders.get('set-cookie');
      
      const nextResponse = NextResponse.json(data);
      if (setCookie) {
        nextResponse.headers.set('Set-Cookie', setCookie);
      }
      return nextResponse;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Dogs API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 