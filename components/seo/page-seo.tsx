import { Metadata } from 'next'
import { SchemaMarkup } from './schema-markup'

interface PageSEOProps {
  title: string
  description: string
  path: string
  keywords?: string[]
  schemaType?: 'SoftwareApplication' | 'WebApplication' | 'FAQPage'
  schemaData?: any
}

export function generatePageMetadata({
  title,
  description,
  path,
  keywords = [],
}: Omit<PageSEOProps, 'schemaType' | 'schemaData'>): Metadata {
  const baseUrl = 'https://zent.ai'
  const fullUrl = `${baseUrl}${path}`
  
  return {
    title,
    description,
    keywords: [...keywords, 'AI presentations', 'slide generator', 'Zent'],
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      type: 'website',
      images: [
        {
          url: '/assets/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: ['/assets/twitter-image.png'],
    },
  }
}

export function PageSEO({ schemaType, schemaData }: Pick<PageSEOProps, 'schemaType' | 'schemaData'>) {
  if (!schemaType) return null
  
  return <SchemaMarkup type={schemaType} data={schemaData} />
}
