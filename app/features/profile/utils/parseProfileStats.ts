/**
 * Converts a numeric hours value to a display string: e.g. 312 → "312h"
 */
export function parseHours(hours: number | null | undefined): string {
  if (hours === null || hours === undefined) return '0h';
  return `${Math.round(hours)}h`;
}

/**
 * Formats a numeric budget to "1 234 €" style
 */
export function formatPrice(budget: number | null | undefined): string {
  if (budget === null || budget === undefined) return '—';
  if (budget === 0) return '0 €';
  return `${Math.round(budget).toLocaleString('fr-FR')} €`;
}

/**
 * Parses a "312h 15m" style string from project working time
 */
export function parseWorkingTime(workingTime: string | null | undefined): string {
  if (!workingTime) return '0h';
  const match = workingTime.match(/^(\d+)h/);
  return match ? `${match[1]}h` : workingTime;
}
