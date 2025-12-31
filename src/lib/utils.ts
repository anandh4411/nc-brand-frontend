import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate initials from a full name
 * @param name - Full name (e.g., "Anandh S" or "John Doe")
 * @returns Initials (e.g., "AS" or "JD")
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === '') return '??';

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word: take first two characters
    return words[0].substring(0, 2).toUpperCase();
  }

  // Multiple words: take first letter of first and last word
  const firstInitial = words[0][0];
  const lastInitial = words[words.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
}
