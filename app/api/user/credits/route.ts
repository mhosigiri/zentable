import { createClient } from '@/lib/supabase/server'
import { getCreditStats } from '@/lib/credits'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const creditStats = await getCreditStats(user.id)
    
    return Response.json(creditStats)
  } catch (error) {
    console.error('Error fetching credit stats:', error)
    return Response.json(
      { error: 'Failed to fetch credit stats' },
      { status: 500 }
    )
  }
}

// Helper endpoint to manually add credits for testing
export async function POST(req: Request) {
  try {
    const { credits, reason = 'Manual credit grant' } = await req.json()
    
    if (!credits || credits <= 0) {
      return Response.json({ error: 'Valid credit amount required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Add credits using database function
    const { data, error } = await supabase.rpc('add_credits', {
      user_uuid: user.id,
      credits_to_add: credits,
      action_type_param: 'credit_grant',
      metadata_param: { reason }
    })

    if (error || !data) {
      return Response.json({ error: 'Failed to add credits' }, { status: 500 })
    }

    // Get updated stats
    const updatedStats = await getCreditStats(user.id)
    
    return Response.json({
      success: true,
      creditsAdded: credits,
      newBalance: updatedStats.balance,
      reason
    })
  } catch (error) {
    console.error('Error adding credits:', error)
    return Response.json(
      { error: 'Failed to add credits' },
      { status: 500 }
    )
  }
}