export interface Currency {
  code: string
  name: string
  /** ISO 3166-1 alpha-2 country code (lowercase) for flag image, e.g. 'us', 'np' */
  countryCode: string
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', countryCode: 'us' },
  { code: 'EUR', name: 'Euro', countryCode: 'eu' },
  { code: 'GBP', name: 'British Pound', countryCode: 'gb' },
  { code: 'JPY', name: 'Japanese Yen', countryCode: 'jp' },
  { code: 'CHF', name: 'Swiss Franc', countryCode: 'ch' },
  { code: 'CAD', name: 'Canadian Dollar', countryCode: 'ca' },
  { code: 'AUD', name: 'Australian Dollar', countryCode: 'au' },
  { code: 'CNY', name: 'Chinese Yuan', countryCode: 'cn' },
  { code: 'INR', name: 'Indian Rupee', countryCode: 'in' },
  { code: 'NPR', name: 'Nepalese Rupee', countryCode: 'np' },
  { code: 'PKR', name: 'Pakistani Rupee', countryCode: 'pk' },
  { code: 'BDT', name: 'Bangladeshi Taka', countryCode: 'bd' },
  { code: 'AED', name: 'UAE Dirham', countryCode: 'ae' },
  { code: 'SAR', name: 'Saudi Riyal', countryCode: 'sa' },
  { code: 'KRW', name: 'South Korean Won', countryCode: 'kr' },
  { code: 'MXN', name: 'Mexican Peso', countryCode: 'mx' },
  { code: 'BRL', name: 'Brazilian Real', countryCode: 'br' },
  { code: 'SGD', name: 'Singapore Dollar', countryCode: 'sg' },
  { code: 'MYR', name: 'Malaysian Ringgit', countryCode: 'my' },
  { code: 'THB', name: 'Thai Baht', countryCode: 'th' },
]

export function getFlagUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode}.png`
}
