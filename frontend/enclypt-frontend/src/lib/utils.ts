// src/utils/cn.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Allowable tokens: letters, numbers, -, _, :, /, brackets, (% .#) for arbitrary values
const VALID_TOKEN = /^[a-zA-Z0-9\-\_:/\[\]\(\)%#\.]+$/

/**
 * Merge & sanitize class names:
 *  - clsx to flatten conditionals
 *  - filter out any invalid tokens
 *  - twMerge to dedupe/conflict-resolve Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  // 1) Build raw string
  const raw = clsx(inputs)

  // 2) Sanitize each token
  const safe = raw
    .split(/\s+/)
    .filter((token) => {
      const ok = VALID_TOKEN.test(token)
      if (!ok) {
        console.warn(`cn(): dropped invalid class token: "${token}"`)
      }
      return ok
    })
    .join(" ")

  // 3) Merge Tailwind conflicts & return
  return twMerge(safe)
}

/**
 * Handy for responsive variants:
 * cnr('md', 'px-4') → 'md:px-4'
 */
export function cnr(breakpoint: string, cls: string) {
  return `${breakpoint}:${cls}`
}
