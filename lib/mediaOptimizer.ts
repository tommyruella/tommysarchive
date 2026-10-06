/**
 * High-performance image optimization helper.
 * Converts raw 5MB-10MB PNGs into light 20KB-200KB WebP/AVIF images
 * using Next.js / Vercel Edge image optimization pipeline.
 */

const VALID_NEXT_WIDTHS = [64, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920];

export function getOptimizedImageUrl(
  url: string,
  targetWidth: number = 1080,
  quality: number = 75
): string {
  if (!url) return "";

  // If already an SVG or data URL, don't pass through image optimizer
  if (url.startsWith("data:") || url.endsWith(".svg") || url.endsWith(".gif")) {
    return url;
  }

  // If already passing through Next image optimizer, return as is
  if (url.startsWith("/_next/image")) {
    return url;
  }

  // Find the smallest standard width that is >= targetWidth
  const width =
    VALID_NEXT_WIDTHS.find((w) => w >= targetWidth) ||
    VALID_NEXT_WIDTHS[VALID_NEXT_WIDTHS.length - 1];

  // Decode first to prevent double-encoding (e.g. %20 -> %2520), then cleanly encode
  let sanitizedUrl = url;
  try {
    sanitizedUrl = decodeURI(url);
  } catch {
    // If malformed or already clean, fallback to original
  }

  return `/_next/image?url=${encodeURIComponent(sanitizedUrl)}&w=${width}&q=${quality}`;
}
