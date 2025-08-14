/**
 * Utility for merging class names with Tailwind CSS
 * Combines clsx for conditional classes and tailwind-merge for conflict resolution
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
