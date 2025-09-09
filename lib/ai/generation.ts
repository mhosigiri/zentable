export interface GenerationSection {
  title: string;
  bulletPoints: string[];
  templateType: string;
}

export interface GenerationDocumentData {
  style?: string;
  language?: string;
  contentLength?: string;
  imageStyle?: string;
  theme?: string;
}

/**
 * Fetches generated slide content from the API.
 * @param section The section data to generate the slide from.
 * @param documentData The overall presentation document data for context.
 * @returns The generated slide data.
 */
export async function fetchGeneratedSlide(section: GenerationSection, documentData: GenerationDocumentData): Promise<any> {
  const response = await fetch('/api/generate-slide', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sectionTitle: section.title,
      bulletPoints: section.bulletPoints,
      templateType: section.templateType,
      style: documentData?.style || 'default',
      language: documentData?.language || 'en',
      contentLength: documentData?.contentLength || 'medium',
      imageStyle: documentData?.imageStyle || 'professional',
    }),
  });

  // Handle credit errors (402) specially
  if (response.status === 402) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Insufficient credits: ${errorData.error || 'Not enough credits to generate slide'}`);
  }

  if (!response.ok) {
    throw new Error('Failed to generate slide content from API');
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error('Invalid response format from slide generation API');
  }

  return result.data;
}

/**
 * Fetches generated slide content from the API for server-side tool calls.
 * This function uses an absolute URL to ensure it works when called from a server environment.
 * @param section The section data to generate the slide from.
 * @param documentData The overall presentation document data for context.
 * @returns The generated slide data.
 */
export async function fetchGeneratedSlideForServer(section: GenerationSection, documentData: GenerationDocumentData): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/generate-slide`;

  console.log(`[Server-side Fetch] Calling generate-slide API at: ${url}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sectionTitle: section.title,
      bulletPoints: section.bulletPoints,
      templateType: section.templateType,
      style: documentData?.style || 'default',
      language: documentData?.language || 'en',
      contentLength: documentData?.contentLength || 'medium',
      imageStyle: documentData?.imageStyle || 'professional',
    }),
  });

  // Handle credit errors (402) specially
  if (response.status === 402) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`[Server-side Fetch] Credit error:`, errorData);
    throw new Error(`Insufficient credits: ${errorData.error || 'Not enough credits to generate slide'}`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Server-side Fetch] API call failed with status ${response.status}: ${errorText}`);
    throw new Error(`Failed to generate slide content from API. Status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    console.error('[Server-side Fetch] Invalid response format from API:', result);
    throw new Error('Invalid response format from slide generation API');
  }

  return result.data;
}

/**
 * Fetches a generated image URL from the API.
 * @param prompt The prompt for the image.
 * @param templateType The template type of the slide.
 * @param theme The current theme of the presentation.
 * @param imageStyle The desired style of the image.
 * @returns An object containing the imageUrl.
 */
export async function fetchGeneratedImage(
  prompt: string,
  templateType: string,
  theme?: string,
  imageStyle?: string
): Promise<{ imageUrl: string }> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      templateType,
      theme,
      imageStyle,
    }),
  });

  // Handle credit errors (402) specially
  if (response.status === 402) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Insufficient credits: ${errorData.error || 'Not enough credits to generate image'}`);
  }

  if (!response.ok) {
    throw new Error('Failed to generate image from API');
  }

  return await response.json();
} 