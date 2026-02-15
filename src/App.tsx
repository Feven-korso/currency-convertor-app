import { useState, useEffect } from 'react'
import { fetchConversion, fetchCurrencies } from './api/frankfurter'
import { buildCurrenciesFromApi } from './data/currencies'
import type { Currency } from './data/currencies'
import { CurrencySelect } from './components/CurrencySelect'
import './App.css'

function App() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [currenciesLoading, setCurrenciesLoading] = useState(true)
  const [currenciesError, setCurrenciesError] = useState<string | null>(null)

  const [amount, setAmount] = useState<string>('1')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('EUR')

  const [converted, setConverted] = useState<number | null>(null)
  const [rateDate, setRateDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchCurrencies(controller.signal)
      .then((apiCurrencies) => {
        if (controller.signal.aborted) return
        const list = buildCurrenciesFromApi(apiCurrencies)
        setCurrencies(list)
        const codes = list.map((c) => c.code)
        if (codes.length >= 2) {
          if (!codes.includes(fromCurrency)) setFromCurrency(codes[0])
          if (!codes.includes(toCurrency) || toCurrency === fromCurrency) {
            const other = codes.find((c) => c !== fromCurrency) ?? codes[1]
            setToCurrency(other)
          }
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setCurrenciesError(err instanceof Error ? err.message : 'Failed to load currencies')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCurrenciesLoading(false)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const num = parseFloat(amount)
    if (amount === '' || amount === '.' || Number.isNaN(num) || num < 0) {
      setConverted(null)
      setRateDate(null)
      setError(null)
      setLoading(false)
      return
    }
    if (currencies.length === 0) return

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchConversion(fromCurrency, toCurrency, num, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setConverted(result.converted)
        setRateDate(result.date)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setConverted(null)
        setRateDate(null)
        setError(err instanceof Error ? err.message : 'Failed to fetch rate')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [amount, fromCurrency, toCurrency, currencies.length])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || value === '.') {
      setAmount(value)
      return
    }
    const parts = value.split('.')
    const intPart = parts[0].replace(/^-/, '') || ''
    if (intPart.length > 12) return
    setAmount(value)
  }

  const num = parseFloat(amount)
  const isValidAmount = amount !== '' && amount !== '.' && !Number.isNaN(num) && num >= 0

  const resultContent = () => {
    if (currenciesError) return <span className="result-error">{currenciesError}</span>
    if (loading) return <span className="result-loading">Loading…</span>
    if (error) return <span className="result-error">{error}</span>
    if (!isValidAmount) return <span className="result-muted">Enter an amount to see the conversion.</span>
    if (converted === null) return null
    return (
      <>
        <span className="result-value">
          {num} {fromCurrency} = {converted.toFixed(2)} {toCurrency}
        </span>
        {rateDate && (
          <span className="result-date">Rate date: {rateDate}</span>
        )}
      </>
    )
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Currency Converter</h1>

        <label className="label" htmlFor="amount">
          Enter Amount
        </label>
        <input
          id="amount"
          type="number"
          className="input"
          value={amount}
          onChange={handleAmountChange}
          min="0"
          step="any"
        />
        <p className="input-hint">Maximum 12 digits before the decimal point.</p>

        <div className="currencies-row">
          <div className="currency-group">
            <label className="label">From</label>
            <CurrencySelect
              currencies={currencies}
              value={fromCurrency}
              onChange={setFromCurrency}
              excludeCode={toCurrency}
              disabled={currenciesLoading}
              aria-label="From currency"
            />
          </div>

          <button
            type="button"
            className="swap-btn"
            onClick={handleSwap}
            aria-label="Swap currencies"
            disabled={currenciesLoading}
          >
            ⇄
          </button>

          <div className="currency-group">
            <label className="label">To</label>
            <CurrencySelect
              currencies={currencies}
              value={toCurrency}
              onChange={setToCurrency}
              excludeCode={fromCurrency}
              disabled={currenciesLoading}
              aria-label="To currency"
            />
          </div>
        </div>

        <p className="result">{resultContent()}</p>

        <button type="button" className="cta-btn">
          Get Exchange Rate
        </button>
      </div>
    </div>
  )
}

export default App
