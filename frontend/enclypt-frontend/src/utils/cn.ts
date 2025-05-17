// src/utils/cn.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// allow only Tailwind‐style tokens (letters, numbers, -, _, :, /, []()%,#.)
const VALID_TOKEN = /^[a-zA-Z0-9\-_:/\[\]\(\)%#\.]+$/

/**
 * Merge, sanitize and dedupe Tailwind class strings.
 */
export function cn(...inputs: ClassValue[]) {
  // flatten
  const raw = clsx(inputs)
  // strip anything sketchy
  const safe = raw
    .split(/\s+/)
    .filter((t) => {
      if (!VALID_TOKEN.test(t)) {
        console.warn(`cn(): dropped invalid token “${t}”`)
        return false
      }
      return true
    })
    .join(" ")
  // merge duplicates / conflicts
  return twMerge(safe)
}

/**
 * Prefix a class with a breakpoint
 */
export function cnr(breakpoint: string, cls: string) {
  return `${breakpoint}:${cls}`
}
