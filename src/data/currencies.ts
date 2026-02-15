export interface Currency {
  code: string
  name: string
  countryCode: string
  flagEmoji: string
}

/** Map ISO 4217 currency code to ISO 3166-1 alpha-2 country/region code for flag display */
export const CURRENCY_TO_COUNTRY: Record<string, string> = {
  AUD: 'au',
  BGN: 'bg',
  BRL: 'br',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',
  CZK: 'cz',
  DKK: 'dk',
  EUR: 'eu',
  GBP: 'gb',
  HKD: 'hk',
  HRK: 'hr',
  HUF: 'hu',
  IDR: 'id',
  ILS: 'il',
  INR: 'in',
  ISK: 'is',
  JPY: 'jp',
  KRW: 'kr',
  MXN: 'mx',
  MYR: 'my',
  NOK: 'no',
  NZD: 'nz',
  PHP: 'ph',
  PLN: 'pl',
  RON: 'ro',
  SEK: 'se',
  SGD: 'sg',
  THB: 'th',
  TRY: 'tr',
  USD: 'us',
  ZAR: 'za',
}

/**
 * Convert a 2-letter country/region code to a flag emoji (e.g. "us" -> 🇺🇸).
 * Uses Unicode regional indicator symbols.
 */
export function countryCodeToFlagEmoji(countryCode: string): string {
  const lower = countryCode.toLowerCase()
  if (lower.length !== 2) return ''
  return [...lower].map((c) => String.fromCodePoint(0x1f1e6 - 97 + c.charCodeAt(0))).join('')
}

/** Flag image URL from FlagCDN (works on all platforms including Windows). */
export function getFlagUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
}

/**
 * Build Currency[] from Frankfurter API response { [code]: name }.
 */
export function buildCurrenciesFromApi(apiCurrencies: Record<string, string>): Currency[] {
  return Object.entries(apiCurrencies).map(([code, name]) => {
    const countryCode = CURRENCY_TO_COUNTRY[code] ?? code.slice(0, 2).toLowerCase()
    const flagEmoji = countryCodeToFlagEmoji(countryCode)
    return { code, name, countryCode, flagEmoji }
  })
}
