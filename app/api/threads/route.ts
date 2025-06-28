import { DatabaseService } from '@/lib/database';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { presentationId, title } = body;
    
    if (!presentationId) {
      return new Response(
        JSON.stringify({ error: 'Missing presentationId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const db = new DatabaseService();
    const threadId = await db.createThread(presentationId, title);
    
    if (!threadId) {
      return new Response(
        JSON.stringify({ error: 'Failed to create thread' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ threadId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating thread:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create thread' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const presentationId = searchParams.get('presentationId');
    
    if (!presentationId) {
      return new Response(
        JSON.stringify({ error: 'Missing presentationId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const db = new DatabaseService();
    const threads = await db.getThreads(presentationId);
    
    return new Response(
      JSON.stringify({ threads }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching threads:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch threads' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
