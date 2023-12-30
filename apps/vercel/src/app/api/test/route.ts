import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge'; // 'nodejs' is the default

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      comment: "Hello, Vercel!",
      body: request.body,
      query: request.nextUrl.search,
      cookies: request.cookies.getAll(),
    },
    {
      status: 200,
    },
  );
}