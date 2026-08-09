import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatPriceRange(
  low: number | null | undefined,
  high: number | null | undefined
): string {
  if ((low == null || low <= 0) && (high == null || high <= 0)) {
    return "Market-linked"
  }
  const format = (value: number) => `₹${value.toLocaleString("en-IN")}`
  if (low != null && low > 0 && high != null && high > 0) {
    return `${format(low)} – ${format(high)}`
  }
  const single = low != null && low > 0 ? low : high
  return single != null && single > 0 ? format(single) : "Market-linked"
}

export function timeAgo(
  value: Date | string | number | null | undefined,
  now: number = Date.now()
): string {
  if (!value) return "recently"
  const time = new Date(value).getTime()
  if (Number.isNaN(time)) return "recently"
  const seconds = Math.max(0, Math.floor((now - time) / 1000))
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}