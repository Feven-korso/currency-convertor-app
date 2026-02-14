/**
 * Mock rate: units of this currency per 1 USD.
 * Example: 1 USD = 118.16 NPR => ratesPerUSD['NPR'] = 118.16
 */
export const ratesPerUSD: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.53,
  CNY: 7.24,
  INR: 83.12,
  NPR: 118.16,
  PKR: 278.5,
  BDT: 110.2,
  AED: 3.67,
  SAR: 3.75,
  KRW: 1320,
  MXN: 17.15,
  BRL: 4.97,
  SGD: 1.34,
  MYR: 4.72,
  THB: 35.5,
}

export function getRate(fromCode: string, toCode: string): number | null {
  if (fromCode === toCode) return 1
  const fromPerUSD = ratesPerUSD[fromCode]
  const toPerUSD = ratesPerUSD[toCode]
  if (fromPerUSD == null || toPerUSD == null) return null
  return toPerUSD / fromPerUSD
}
