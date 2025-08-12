/**
 * Utility for merging Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * @module utils/cn
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge CSS classes with Tailwind CSS precedence
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged and deduplicated className string
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-primary', condition && 'text-error') // => conditional class
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}