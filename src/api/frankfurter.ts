const BASE_URL = 'https://api.frankfurter.app'

export interface ConversionResult {
  converted: number
  date: string
  rate: number
}

/**
 * Fetch conversion from Frankfurter API (no API key required).
 * @see https://www.frankfurter.app/docs/
 */
export async function fetchConversion(
  from: string,
  to: string,
  amount: number,
  signal?: AbortSignal
): Promise<ConversionResult> {
  if (from === to) {
    return {
      converted: amount,
      date: new Date().toISOString().slice(0, 10),
      rate: 1,
    }
  }

  const params = new URLSearchParams({
    from,
    to,
    amount: String(amount),
  })
  const url = `${BASE_URL}/latest?${params}`
  const res = await fetch(url, { signal })

  if (!res.ok) {
    let message = `Failed to fetch rate (${res.status})`
    try {
      const err = await res.json()
      if (err?.message) message = err.message
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  const data = await res.json()
  const converted = data.rates[to] as number
  const rate = amount !== 0 ? converted / amount : 0

  return {
    converted,
    date: data.date,
    rate,
  }
}
