"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getUserImages } from "@/lib/slide-images"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"

interface ImageStats {
  totalImages: number
  totalPresentations: number
  recentImages: number
}

export function ImageStats() {
  const [stats, setStats] = useState<ImageStats>({ totalImages: 0, totalPresentations: 0, recentImages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImageStats = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setLoading(false)
          return
        }

        const images = await getUserImages(user.id)
        
        setStats({
          totalImages: images.length,
          totalPresentations: new Set(images.map(img => img.presentation_id)).size,
          recentImages: images.filter(img => 
            new Date(img.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length
        })
      } catch (error) {
        console.error('Error fetching image stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImageStats()
  }, [])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Generated Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">-</div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </CardContent>
      </Card>
    )
  }

  if (stats.totalImages === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Generated Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">0</div>
          <p className="text-xs text-muted-foreground">
            Images you generate will appear here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Generated Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{stats.totalImages}</div>
        <p className="text-xs text-muted-foreground mb-3">
          Across {stats.totalPresentations} presentations
          {stats.recentImages > 0 && ` • ${stats.recentImages} this week`}
        </p>
        <Button size="sm" variant="outline" asChild>
          <Link href="/dashboard/images">
            View All
            <ArrowRightIcon className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
