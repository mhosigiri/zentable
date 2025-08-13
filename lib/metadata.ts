import { Metadata } from 'next';
import { DatabaseService } from '@/lib/database';
import { createClient } from '@/lib/supabase/client';

// Generate dynamic metadata for presentation pages
export async function generatePresentationMetadata(
  presentationId: string
): Promise<Metadata> {
  const defaultMetadata: Metadata = {
    title: 'Presentation | Zentable',
    description: 'AI-powered presentation created with Zentable',
    openGraph: {
      title: 'Presentation | Zentable',
      description: 'AI-powered presentation created with Zentable',
      images: ['/assets/Zentable_Hero.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Presentation | Zentable',
      description: 'AI-powered presentation created with Zentable',
      images: ['/assets/Zentable_Hero.png'],
    },
  };

  try {
    const supabase = createClient();
    const db = new DatabaseService(supabase);
    
    const presentation = await db.getPresentation(presentationId);
    
    if (!presentation) {
      return defaultMetadata;
    }

    const title = presentation.title || presentation.outline?.title || 'Untitled Presentation';
    const description = presentation.prompt || 'AI-powered presentation created with Zentable';
    const pageTitle = `${title} | Zentable`;

    return {
      title: pageTitle,
      description: description.slice(0, 160), // Limit description to 160 chars for SEO
      openGraph: {
        type: 'article',
        title: pageTitle,
        description: description.slice(0, 160),
        url: `https://zentableai.com/docs/${presentationId}`,
        siteName: 'Zentable',
        images: [
          {
            url: '/assets/Zentable_Hero.png',
            width: 1200,
            height: 630,
            alt: `${title} - Zentable Presentation`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: description.slice(0, 160),
        images: ['/assets/Zentable_Hero.png'],
      },
      robots: {
        index: false, // Don't index individual presentations for privacy
        follow: true,
      },
    };
  } catch (error) {
    console.warn('Failed to generate dynamic metadata:', error);
    return defaultMetadata;
  }
}

// Generate metadata for pricing page
export const pricingMetadata: Metadata = {
  title: 'Pricing | Zentable - AI Presentation Builder',
  description: 'Choose the perfect plan for your presentation needs. Start free with 500 credits, upgrade to Lite ($5/month) or Pro ($15/month) for more features.',
  keywords: ['pricing', 'plans', 'AI presentation pricing', 'subscription', 'presentation builder cost'],
  openGraph: {
    title: 'Pricing | Zentable - AI Presentation Builder',
    description: 'Choose the perfect plan for your presentation needs. Start free with 500 credits, upgrade for more features.',
    url: 'https://zentableai.com/pricing',
    images: ['/assets/Zentable_Hero.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | Zentable - AI Presentation Builder',
    description: 'Choose the perfect plan for your presentation needs. Start free with 500 credits.',
    images: ['/assets/Zentable_Hero.png'],
  },
};

// Generate metadata for docs pages
export function generateDocsMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const pageTitle = `${title} | Zentable Docs`;
  
  return {
    title: pageTitle,
    description,
    keywords: ['documentation', 'guide', 'AI presentations', 'tutorial', title.toLowerCase()],
    openGraph: {
      title: pageTitle,
      description,
      url: `https://zentableai.com/${path}`,
      type: 'article',
      images: ['/assets/Zentable_Hero.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: ['/assets/Zentable_Hero.png'],
    },
  };
}