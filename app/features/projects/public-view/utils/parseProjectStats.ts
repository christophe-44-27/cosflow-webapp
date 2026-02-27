/**
 * Extracts the hour count from a working time string.
 * Examples: "312h 30m" → "312h", "45h" → "45h", null → "0h"
 */
export function parseHours(workingTime: string | null | undefined): string {
  if (!workingTime) return '0h';
  const match = workingTime.match(/^(\d+)h/);
  return match ? `${match[1]}h` : workingTime;
}

/**
 * Formats a price string for display.
 * Returns "—" if null/undefined, otherwise appends " €".
 */
export function formatPrice(estimatedPrice: string | null | undefined): string {
  if (estimatedPrice === null || estimatedPrice === undefined) return '—';
  return `${estimatedPrice} €`;
}

/**
 * Formats an element price (string | number | null) for display.
 */
export function formatElementPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined || price === '') return '—';
  return `${price} €`;
}
