import { TOOL_NAME_MAP } from './constants';

// Utility functions for assistant-ui components

/**
 * Convert technical tool names to user-friendly descriptions
 */
export const getUserFriendlyToolName = (toolName: string): string => {
  return TOOL_NAME_MAP[toolName] || toolName;
};

/**
 * Check if code content appears to be HTML slide content
 */
export const isSlideHtmlContent = (code: string): boolean => {
  const slideHtmlPattern = /<h[1-3]>|<p>|<ul>|<li>|<ol>/i;
  const nonSlidePattern = /<script|<style|<iframe|<canvas|<svg|<nav|<header|<footer|<!DOCTYPE/i;
  
  return slideHtmlPattern.test(code) && !nonSlidePattern.test(code);
};

/**
 * Extract title from HTML content if possible
 */
export const extractTitleFromHtml = (html: string): string => {
  const titleMatch = html.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/i);
  return titleMatch ? titleMatch[1] : '';
};

/**
 * Generate localStorage key for thread management
 */
export const getThreadStorageKey = (presentationId: string): string => {
  return `threadId_${presentationId}`;
};

/**
 * Generate localStorage key for thread cleanup
 */
export const getThreadCleanupKey = (presentationId: string): string => {
  return `thread_${presentationId}`;
}; 