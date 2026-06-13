import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentPath(pathname: string): string {
  // Remove language prefix if exists
  return pathname.replace(/^\/(tr|en)/, '');
}
