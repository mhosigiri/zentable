import { useState, useEffect, useCallback } from 'react'
import { SlideImageData, SlideWithImages } from '@/lib/supabase'

interface UseSlideImagesReturn {
  images: SlideImageData[]
  loading: boolean
  error: string | null
  addImage: (imageData: Partial<SlideImageData>) => Promise<void>
  updateImage: (imageId: string, updates: Partial<SlideImageData>) => Promise<void>
  deleteImage: (imageId: string) => Promise<void>
  reorderImages: (imageIds: string[]) => Promise<void>
  setPrimaryImage: (imageId: string) => Promise<void>
  refreshImages: () => Promise<void>
}

/**
 * Hook for managing multiple images for a slide
 */
export function useSlideImages(slideId: string): UseSlideImagesReturn {
  const [images, setImages] = useState<SlideImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImages = useCallback(async () => {
    if (!slideId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/slides/${slideId}/images`)
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      setImages(data.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [slideId])

  const addImage = useCallback(async (imageData: Partial<SlideImageData>) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/slides/${slideId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      })

      if (!response.ok) {
        throw new Error('Failed to add image')
      }

      await fetchImages() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [slideId, fetchImages])

  const updateImage = useCallback(async (imageId: string, updates: Partial<SlideImageData>) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/slides/${slideId}/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update image')
      }

      await fetchImages() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [slideId, fetchImages])

  const deleteImage = useCallback(async (imageId: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/slides/${slideId}/images/${imageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      await fetchImages() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [slideId, fetchImages])

  const reorderImages = useCallback(async (imageIds: string[]) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/slides/${slideId}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reorder',
          imageIds,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reorder images')
      }

      await fetchImages() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [slideId, fetchImages])

  const setPrimaryImage = useCallback(async (imageId: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/slides/${slideId}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'setPrimary',
          imageId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to set primary image')
      }

      await fetchImages() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [slideId, fetchImages])

  const refreshImages = useCallback(async () => {
    await fetchImages()
  }, [fetchImages])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  return {
    images,
    loading,
    error,
    addImage,
    updateImage,
    deleteImage,
    reorderImages,
    setPrimaryImage,
    refreshImages,
  }
}

interface UseSlideWithImagesReturn {
  slide: SlideWithImages | null
  loading: boolean
  error: string | null
  refreshSlide: () => Promise<void>
}

/**
 * Hook for getting a slide with all its images
 */
export function useSlideWithImages(slideId: string): UseSlideWithImagesReturn {
  const [slide, setSlide] = useState<SlideWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSlide = useCallback(async () => {
    if (!slideId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/slides/${slideId}/generate-images`)
      if (!response.ok) {
        throw new Error('Failed to fetch slide with images')
      }

      const data = await response.json()
      setSlide(data.slide)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [slideId])

  const refreshSlide = useCallback(async () => {
    await fetchSlide()
  }, [fetchSlide])

  useEffect(() => {
    fetchSlide()
  }, [fetchSlide])

  return {
    slide,
    loading,
    error,
    refreshSlide,
  }
}
