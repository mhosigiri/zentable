"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DatabaseService, type Presentation } from "@/lib/database"
import { getThemeById } from "@/lib/themes"
import { SlideRenderer } from "@/components/slides/SlideRenderer"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { PlusIcon, FileTextIcon, CalendarIcon, MoreVerticalIcon } from "lucide-react"

interface PresentationWithFirstSlide extends Presentation {
  firstSlide?: any
}

export function SectionCards() {
  const [presentations, setPresentations] = useState<PresentationWithFirstSlide[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const dbService = new DatabaseService(supabase)

  useEffect(() => {
    fetchUserPresentations()
  }, [])

  const fetchUserPresentations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const userPresentations = await dbService.getUserPresentations(user.id)
      
      const presentationsWithPreviews = await Promise.all(
        userPresentations.map(async (presentation) => {
          try {
            const { data: slides } = await supabase
              .from('slides')
              .select('*')
              .eq('presentation_id', presentation.id)
              .order('position', { ascending: true })
              .limit(1)

            return {
              ...presentation,
              firstSlide: slides && slides.length > 0 ? slides[0] : null
            }
          } catch (error) {
            console.error('Error fetching first slide:', error)
            return presentation
          }
        })
      )

      setPresentations(presentationsWithPreviews)
    } catch (error) {
      console.error('Error fetching presentations:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'generating':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const handlePresentationClick = (presentationId: string) => {
    router.push(`/docs/${presentationId}`)
  }

  const handleRename = async (presentation: PresentationWithFirstSlide) => {
    const newTitle = prompt("Enter new presentation title:", presentation.title)
    if (newTitle && newTitle.trim() !== presentation.title) {
      try {
        await dbService.updatePresentation(presentation.id, { title: newTitle.trim() })
        toast.success("Presentation renamed successfully")
        await fetchUserPresentations()
      } catch (error) {
        console.error('Error renaming presentation:', error)
        toast.error("Failed to rename presentation")
      }
    }
  }

  const handleHardDelete = async (presentation: PresentationWithFirstSlide) => {
    const confirmed = confirm("Are you sure you want to permanently delete this presentation? This action cannot be undone.")
    if (confirmed) {
      try {
        await dbService.deletePresentation(presentation.id)
        toast.success("Presentation permanently deleted")
        await fetchUserPresentations()
      } catch (error) {
        console.error('Error deleting presentation:', error)
        toast.error("Failed to delete presentation")
      }
    }
  }

  const handleCopyLink = (presentationId: string) => {
    const url = `${window.location.origin}/docs/${presentationId}`
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard")
  }

  const handleCreateNew = () => {
    router.push('/create')
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-screen-2xl px-4 lg:px-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse w-full max-w-sm mx-auto h-80">
            <CardHeader className="relative p-4">
              <div className="w-full aspect-video bg-muted rounded-md mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2 mt-2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-screen-2xl px-4 lg:px-6">
        {/* Create New Presentation Card */}
        <Card 
          className="cursor-pointer border-dashed border-2 hover:border-primary/50 transition-colors group w-full max-w-sm mx-auto h-80 min-w-0 flex flex-col"
          onClick={handleCreateNew}
        >
          <CardHeader className="flex flex-col items-center justify-center flex-1 text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <PlusIcon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Create New Presentation</CardTitle>
            <CardDescription>Start building your next presentation</CardDescription>
          </CardHeader>
        </Card>

        {/* User Presentations */}
        {presentations.map((presentation) => {
          const theme = getThemeById(presentation.theme_id);
          return (
            <Card 
              key={presentation.id}
              className="cursor-pointer hover:border-primary transition-colors group w-full max-w-sm mx-auto h-80 min-w-0 flex flex-col overflow-hidden"
              onClick={() => handlePresentationClick(presentation.id)}
            >
              <CardHeader className="relative p-4 flex-1 flex flex-col min-h-0">
                {/* Slide Preview - Themed background, no shadow, uniform size */}
                <div 
                  className="w-full aspect-video rounded-md mb-3 overflow-hidden relative flex-shrink-0"
                  style={{ background: theme.background }}
                >
                  {presentation.firstSlide ? (
                    <div
                      className="absolute inset-0"
                      style={{
                        width: '333%',
                        height: '333%',
                        transform: 'scale(0.3)',
                        transformOrigin: 'center',
                        left: '-116.5%',
                        top: '-116.5%',
                      }}
                    >
                      <div className="w-full h-full pointer-events-none">
                        <SlideRenderer 
                          slide={{
                            id: presentation.firstSlide.id,
                            templateType: presentation.firstSlide.template_type,
                            title: presentation.firstSlide.title,
                            content: presentation.firstSlide.content,
                            bulletPoints: presentation.firstSlide.bullet_points,
                            imageUrl: presentation.firstSlide.image_url,
                            imagePrompt: presentation.firstSlide.image_prompt,
                          }}
                          isEditable={false}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <FileTextIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* 3-dot Menu - Top Left */}
                <div className="absolute left-4 top-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/docs/${presentation.id}`)
                        }}
                      >
                        Open Presentation
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRename(presentation)
                        }}
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyLink(presentation.id)
                        }}
                      >
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleHardDelete(presentation)
                        }}
                      >
                        Delete Permanently
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Status Badge - Adjusted position */}
                <div className="absolute right-4 top-4">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(presentation.status)}`}
                  >
                    {presentation.status}
                  </Badge>
                </div>

                {/* Presentation Info - Flexible content area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors mb-1 break-words">
                    {presentation.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2 flex-1 break-words overflow-hidden">
                    {presentation.prompt}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardFooter className="flex items-center justify-between text-xs text-muted-foreground p-4 pt-0 mt-auto gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 min-w-0 flex-shrink">
                  <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{formatDate(presentation.created_at)}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    {presentation.card_count} slides
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize px-1.5 py-0.5">
                    {presentation.style}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          )}
        )}
      </div>
    </div>
  )
}