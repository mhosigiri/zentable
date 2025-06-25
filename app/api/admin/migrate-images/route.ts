import { NextRequest, NextResponse } from 'next/server'
import { 
  migrateAllLegacyImages, 
  validateImageSystemIntegrity, 
  fixImageSystemIntegrity 
} from '@/lib/migrate-images'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/migrate-images
 * Migrate legacy single images to multiple images system
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action

    switch (action) {
      case 'migrate':
        await migrateAllLegacyImages()
        return NextResponse.json({ 
          success: true, 
          message: 'Legacy images migration completed' 
        })

      case 'validate':
        const validation = await validateImageSystemIntegrity()
        return NextResponse.json({ 
          success: true, 
          validation 
        })

      case 'fix':
        await fixImageSystemIntegrity()
        return NextResponse.json({ 
          success: true, 
          message: 'Image system integrity fixes applied' 
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: migrate, validate, or fix' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in image migration/maintenance:', error)
    return NextResponse.json(
      { error: 'Migration/maintenance operation failed', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/migrate-images
 * Get status of image system
 */
export async function GET() {
  try {
    const validation = await validateImageSystemIntegrity()
    return NextResponse.json({ 
      success: true, 
      status: validation.valid ? 'healthy' : 'issues_found',
      validation 
    })
  } catch (error) {
    console.error('Error checking image system status:', error)
    return NextResponse.json(
      { error: 'Failed to check system status', details: String(error) },
      { status: 500 }
    )
  }
}
