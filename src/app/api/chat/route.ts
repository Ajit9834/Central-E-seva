import { NextRequest, NextResponse } from 'next/server';
import { processMessage } from '@/lib/chatEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message } = body as { sessionId: string | null; message: string };

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await processMessage(sessionId, message);
    return NextResponse.json(response);
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
