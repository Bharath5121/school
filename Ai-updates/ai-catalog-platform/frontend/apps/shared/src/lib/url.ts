const ALLOWED_PROTOCOLS = ['https:', 'http:'];

/**
 * Validates an external URL to prevent javascript: and data: URI attacks.
 * Returns the URL if safe, or '#' as a fallback.
 */
export function safeExternalUrl(url: string | undefined | null): string {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    if (ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return url;
    }
    return '#';
  } catch {
    if (url.startsWith('/')) return url;
    return '#';
  }
}
