"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ExternalLinkIcon, 
  EyeIcon, 
  DownloadIcon,
  CopyIcon,
  MoreVerticalIcon 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import Link from "next/link"

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

interface ImageGridProps {
  images: UserImage[]
}

export function ImageGrid({ images }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<UserImage | null>(null)

  const copyImageUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden group">
          <CardHeader className="p-0">
            <div className="relative aspect-video bg-muted">
              {image.image_url ? (
                <Image
                  src={image.image_url}
                  alt={image.image_prompt || "Generated image"}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="text-sm">No image</div>
                  </div>
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={() => window.open(image.image_url || '', '_blank')}
                    disabled={!image.image_url}
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={() => image.image_url && downloadImage(image.image_url, `image-${image.id}.png`)}
                    disabled={!image.image_url}
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium truncate">
                    {image.presentation_title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    Slide {image.slide_position + 1}: {image.slide_title || "Untitled"}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <MoreVerticalIcon className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/docs/${image.presentation_id}`}>
                        <ExternalLinkIcon className="h-4 w-4 mr-2" />
                        View Presentation
                      </Link>
                    </DropdownMenuItem>
                    {image.image_url && (
                      <>
                        <DropdownMenuItem onClick={() => copyImageUrl(image.image_url!)}>
                          <CopyIcon className="h-4 w-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadImage(image.image_url!, `image-${image.id}.png`)}>
                          <DownloadIcon className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {image.image_prompt && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {image.image_prompt}
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-3 pt-0 flex items-center justify-between">
            <div className="flex gap-1">
              {image.image_type && (
                <Badge variant="secondary" className="text-xs">
                  {image.image_type}
                </Badge>
              )}
              {image.aspect_ratio && (
                <Badge variant="outline" className="text-xs">
                  {image.aspect_ratio}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(image.created_at), 'MMM d, yyyy')}
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
