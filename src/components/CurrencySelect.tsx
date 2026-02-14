import { useState, useRef, useEffect } from 'react'
import { currencies, getFlagUrl } from '../data/currencies'

interface CurrencySelectProps {
  value: string
  onChange: (code: string) => void
  'aria-label'?: string
}

export function CurrencySelect({ value, onChange, 'aria-label': ariaLabel }: CurrencySelectProps) {
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

  return (
    <div className="currency-select" ref={containerRef}>
      <button
        type="button"
        className="currency-select-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
      >
        <img
          src={getFlagUrl(selected.countryCode)}
          alt=""
          className="currency-select-flag"
          width={24}
          height={18}
        />
        <span className="currency-select-code">{selected.code}</span>
        <span className="currency-select-chevron" aria-hidden>▼</span>
      </button>
      {open && (
        <ul
          className="currency-select-dropdown"
          role="listbox"
          aria-label={ariaLabel}
        >
          {currencies.map((c) => (
            <li
              key={c.code}
              role="option"
              aria-selected={c.code === value}
              className="currency-select-option"
              onClick={() => {
                onChange(c.code)
                setOpen(false)
              }}
            >
              <img
                src={getFlagUrl(c.countryCode)}
                alt=""
                className="currency-select-flag"
                width={24}
                height={18}
              />
              <span>{c.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
