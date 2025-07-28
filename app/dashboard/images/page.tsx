"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getUserImages } from "@/lib/slide-images"
import { createClient } from "@/lib/supabase/client"
import { ImageGrid } from "@/components/dashboard/image-grid"
import { Button } from "@/components/ui/button"
import { ImageIcon, RefreshCwIcon } from "lucide-react"
import { format } from "date-fns"

interface UserImage {
  id: string
  image_url: string | null
  image_prompt: string | null
  image_type: string | null
  aspect_ratio: string | null
  created_at: string
  updated_at: string | null
  slide_id: string
  slide_title: string | null
  presentation_id: string
  presentation_title: string
  slide_position: number
}

export default function DashboardImagesPage() {
  const [images, setImages] = useState<UserImage[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const fetchUserImages = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      const userImages = await getUserImages(userId)
      setImages(userImages)
    } catch (error) {
      console.error('Error fetching user images:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchUserImages()
    }
  }, [userId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* Header */}
                <div className="flex items-center justify-between px-4 lg:px-6">
                  <div>
                    <h1 className="text-2xl font-semibold">Generated Images</h1>
                    <p className="text-muted-foreground">
                      All images generated across your presentations
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUserImages}
                    disabled={loading}
                  >
                    <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-3">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Images</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">{images.length}</div>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Presentations</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {new Set(images.map(img => img.presentation_id)).size}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">This Month</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {images.filter(img => 
                        new Date(img.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      ).length}
                    </div>
                  </div>
                </div>

                {/* Image Grid */}
                <div className="px-4 lg:px-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCwIcon className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No images yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Images you generate for your presentations will appear here.
                      </p>
                    </div>
                  ) : (
                    <ImageGrid images={images} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
