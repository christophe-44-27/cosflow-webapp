import type { Currency } from '@/app/types/models';

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
 * Returns the currency symbol for a given ISO 4217 code.
 * Falls back to the code itself if Intl resolution fails.
 * Examples: "EUR" → "€", "USD" → "$", "CAD" → "CA$", "GBP" → "£"
 */
function getCurrencySymbol(codeIso: string): string {
  try {
    const parts = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: codeIso,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).formatToParts(0);
    return parts.find((p) => p.type === 'currency')?.value ?? codeIso;
  } catch {
    return codeIso;
  }
}

/**
 * Formats a price string for display.
 * Returns "—" if null/undefined, otherwise appends the currency symbol.
 */
export function formatPrice(
  estimatedPrice: string | null | undefined,
  currency: Currency | null | undefined,
): string {
  if (estimatedPrice === null || estimatedPrice === undefined) return '—';
  const symbol = currency?.code_iso ? getCurrencySymbol(currency.code_iso) : '€';
  return `${estimatedPrice} ${symbol}`;
}

/**
 * Formats an element price (string | number | null) for display.
 */
export function formatElementPrice(
  price: string | number | null | undefined,
  currency: Currency | null | undefined,
): string {
  if (price === null || price === undefined || price === '') return '—';
  const symbol = currency?.code_iso ? getCurrencySymbol(currency.code_iso) : '€';
  return `${price} ${symbol}`;
}
