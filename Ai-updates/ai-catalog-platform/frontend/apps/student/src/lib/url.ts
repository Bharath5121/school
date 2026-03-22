const ALLOWED_PROTOCOLS = ['https:', 'http:'];

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
