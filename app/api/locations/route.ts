import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (action === 'search') {
      const response = await fetch(`${API_BASE_URL}/locations/search`, {
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
        console.error('Failed to search locations:', errorText);
        throw new Error('Failed to search locations');
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
    console.error('Locations API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/locations`, {
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
      console.error('Failed to fetch locations:', errorText);
      throw new Error('Failed to fetch locations');
    }

    const data = await response.json();
    const responseHeaders = new Headers(response.headers);
    const setCookie = responseHeaders.get('set-cookie');
    
    const nextResponse = NextResponse.json(data);
    if (setCookie) {
      nextResponse.headers.set('Set-Cookie', setCookie);
    }
    return nextResponse;
  } catch (error) {
    console.error('Locations API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 