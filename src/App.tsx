import { useState, useEffect } from 'react'
import { fetchConversion } from './api/frankfurter'
import { CurrencySelect } from './components/CurrencySelect'
import './App.css'

function App() {
  const [amount, setAmount] = useState<string>('1')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('NPR')

  const [converted, setConverted] = useState<number | null>(null)
  const [rateDate, setRateDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const num = parseFloat(amount)
    if (amount === '' || amount === '.' || Number.isNaN(num) || num < 0) {
      setConverted(null)
      setRateDate(null)
      setError(null)
      setLoading(false)
      return
    }

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
  }, [amount, fromCurrency, toCurrency])

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
              value={fromCurrency}
              onChange={setFromCurrency}
              excludeCode={toCurrency}
              aria-label="From currency"
            />
          </div>

          <button
            type="button"
            className="swap-btn"
            onClick={handleSwap}
            aria-label="Swap currencies"
          >
            ⇄
          </button>

          <div className="currency-group">
            <label className="label">To</label>
            <CurrencySelect
              value={toCurrency}
              onChange={setToCurrency}
              excludeCode={fromCurrency}
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
