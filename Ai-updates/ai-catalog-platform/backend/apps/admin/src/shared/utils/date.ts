export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isWithinDays(date: Date, days: number): boolean {
  const diff = Date.now() - date.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}
