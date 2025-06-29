import { DatabaseService } from '@/lib/database';
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();
    const { presentationId, title } = body;
    
    if (!presentationId) {
      return new Response(
        JSON.stringify({ error: 'Missing presentationId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const db = new DatabaseService(supabase);
    const threadId = await db.createThread(presentationId, title, user.id);
    
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const presentationId = searchParams.get('presentationId');
    
    if (!presentationId) {
      return new Response(
        JSON.stringify({ error: 'Missing presentationId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const db = new DatabaseService(supabase);
    const threads = await db.getThreads(presentationId, user.id);
    
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
