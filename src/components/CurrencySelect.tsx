import { useState, useRef, useEffect } from 'react'
import { getFlagUrl, type Currency } from '../data/currencies'

interface CurrencySelectProps {
  currencies: Currency[]
  value: string
  onChange: (code: string) => void
  excludeCode?: string
  disabled?: boolean
  'aria-label'?: string
}

export function CurrencySelect({
  currencies,
  value,
  onChange,
  excludeCode,
  disabled = false,
  'aria-label': ariaLabel,
}: CurrencySelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = currencies.find((c) => c.code === value) ?? currencies[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (currencies.length === 0) {
    return (
      <div className="currency-select currency-select-loading">
        <button type="button" className="currency-select-trigger" disabled>
          <span className="currency-select-code">Loading currencies…</span>
        </button>
      </div>
    )
  }

  return (
    <div className="currency-select" ref={containerRef}>
      <button
        type="button"
        className="currency-select-trigger"
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
      >
        {selected?.countryCode && (
          <img
            src={getFlagUrl(selected.countryCode)}
            alt=""
            className="currency-select-flag"
            width={24}
            height={18}
          />
        )}
        <span className="currency-select-code">{selected?.code ?? value}</span>
        <span className="currency-select-chevron" aria-hidden>▼</span>
      </button>
      {open && (
        <ul
          className="currency-select-dropdown"
          role="listbox"
          aria-label={ariaLabel}
        >
          {currencies.map((c) => {
            const isDisabled = excludeCode != null && c.code === excludeCode
            return (
              <li
                key={c.code}
                role="option"
                aria-selected={c.code === value}
                aria-disabled={isDisabled}
                className={`currency-select-option${isDisabled ? ' currency-select-option-disabled' : ''}`}
                onClick={() => {
                  if (isDisabled) return
                  onChange(c.code)
                  setOpen(false)
                }}
              >
                {c.countryCode && (
                  <img
                    src={getFlagUrl(c.countryCode)}
                    alt=""
                    className="currency-select-flag"
                    width={24}
                    height={18}
                  />
                )}
                <span>{c.code}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
