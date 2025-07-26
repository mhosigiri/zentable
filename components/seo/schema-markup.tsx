import Script from 'next/script'

interface SchemaMarkupProps {
  type: 'SoftwareApplication' | 'WebApplication' | 'FAQPage' | 'BreadcrumbList'
  data?: any
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const getSchemaData = () => {
    const baseUrl = 'https://zent.ai'
    
    switch (type) {
      case 'SoftwareApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Zent',
          description: 'AI-powered presentation builder that transforms ideas into stunning visual stories',
          url: baseUrl,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250'
          },
          featureList: [
            'AI-powered slide generation',
            'Multiple slide templates',
            'Real-time collaboration',
            'Export to PDF',
            'Presentation mode'
          ]
        }
      
      case 'WebApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Zent AI Presentation Builder',
          description: 'Create professional presentations with artificial intelligence',
          url: baseUrl,
          applicationCategory: 'Productivity',
          browserRequirements: 'Requires JavaScript. Requires HTML5.',
          permissions: 'none'
        }
      
      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data?.faqs || []
        }
      
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.breadcrumbs || []
        }
      
      default:
        return null
    }
  }

  const schemaData = getSchemaData()
  
  if (!schemaData) return null

  return (
    <Script
      id={`schema-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  )
}
