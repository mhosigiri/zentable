// Assistant UI Constants and Mappings

// Tool name to user-friendly description mapping
export const TOOL_NAME_MAP: Record<string, string> = {
  'updateSlideImage': 'Updating Slide Image',
  'applyTheme': 'Applying Theme',
  'changeSlideTemplate': 'Changing Slide Template',
  'createSlide': 'Creating Slide',
  'createSlideWithAI': 'Creating AI-Generated Slide',
  'deleteSlide': 'Deleting Slide',
  'duplicateSlide': 'Duplicating Slide',
  'moveSlide': 'Moving Slide',
  'getSlideContent': 'Viewing Slide Content',
  'updateSlideContent': 'Updating Slide Content',
  'getSlideIdByNumber': 'Getting Slide Content',
  'getSlideById': 'Retrieving Slide',
  'getAllSlides': 'Getting All Slides',
  'getOutline': 'Retrieving Outline',
  'generateImage': 'Generating Image',
};

// Tool categories for icon mapping
export const TOOL_CATEGORIES = {
  IMAGE_TOOLS: ['updateSlideImage', 'generateImage'],
  SLIDE_OPERATIONS: ['applyTheme', 'changeSlideTemplate', 'updateSlideContent', 'createSlide', 'duplicateSlide', 'moveSlide', 'deleteSlide'],
  CONTENT_VIEWING: ['getSlideContent', 'getSlideIdByNumber'],
} as const;

// Common CSS classes for glass morphism effects
export const GLASS_CLASSES = {
  container: 'bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-zinc-800/20',
  card: 'bg-white/10 border border-white/20 rounded-lg backdrop-blur shadow-lg',
  button: 'bg-white/10 dark:bg-black/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-black/20 border border-white/20 dark:border-zinc-800/20',
} as const;

// Common transition classes
export const TRANSITION_CLASSES = {
  smooth: 'transition-all duration-300 ease-in-out',
  opacity: 'transition-opacity ease-in',
  colors: 'transition-colors ease-in',
} as const;

// Common spacing and sizing
export const SPACING = {
  gap: 'gap-3',
  padding: 'p-4',
  margin: 'my-4',
} as const; 