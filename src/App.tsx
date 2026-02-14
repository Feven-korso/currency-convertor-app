import { useState, useMemo } from 'react'
import { getRate } from './data/rate'
import { CurrencySelect } from './components/CurrencySelect'
import './App.css'

function App() {
  const [amount, setAmount] = useState<string>('1')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('NPR')

  const rate = useMemo(() => getRate(fromCurrency, toCurrency), [fromCurrency, toCurrency])
  const converted = useMemo(() => {
    const num = parseFloat(amount) || 0
    if (rate === null) return null
    return Math.round(num * rate * 100) / 100
  }, [amount, rate])

  const resultText = useMemo(() => {
    const num = parseFloat(amount) || 0
    if (rate === null) return 'Rate not available'
    if (converted === null) return 'Rate not available'
    return `${num} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}`
  }, [amount, fromCurrency, toCurrency, converted, rate])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
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
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="any"
        />

        <div className="currencies-row">
          <div className="currency-group">
            <label className="label">From</label>
            <CurrencySelect
              value={fromCurrency}
              onChange={setFromCurrency}
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
              aria-label="To currency"
            />
          </div>
        </div>

        <p className="result">{resultText}</p>

        <button type="button" className="cta-btn">
          Get Exchange Rate
        </button>
      </div>
    </div>
  )
}

export default App
