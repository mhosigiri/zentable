import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { marked } from 'marked'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Configure marked for safe HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
})

/**
 * Converts markdown text to HTML for use in TiptapEditor
 */
export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  try {
    // Parse markdown to HTML
    const html = marked.parse(markdown);
    return typeof html === 'string' ? html : '';
  } catch (error) {
    console.warn('Failed to parse markdown:', error);
    // Return original text if parsing fails
    return markdown;
  }
}

/**
 * Checks if text contains markdown formatting
 */
export function hasMarkdownFormatting(text: string): boolean {
  if (!text) return false;
  
  // Check for common markdown patterns
  const markdownPatterns = [
    /\*\*.*?\*\*/,  // Bold
    /\*.*?\*/,      // Italic
    /^#{1,6}\s/m,   // Headers
    /^\* /m,        // Unordered lists
    /^\d+\. /m,     // Ordered lists
    /\[.*?\]\(.*?\)/, // Links
    /`.*?`/,        // Inline code
  ];
  
  return markdownPatterns.some(pattern => pattern.test(text));
}
