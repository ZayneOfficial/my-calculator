import { useState } from 'react'
import './App.css'

const formatValue = (value) => {
  if (!Number.isFinite(value)) {
    return 'Error'
  }

  const normalized = String(value)
  return normalized.includes('.') ? normalized.replace(/\.0+$|(?<=\.[0-9]*?)0+$/, '') : normalized
}

const compute = (firstValue, secondValue, operator) => {
  switch (operator) {
    case '+':
      return firstValue + secondValue
    case '-':
      return firstValue - secondValue
    case '*':
      return firstValue * secondValue
    case '/':
      return secondValue === 0 ? Number.NaN : firstValue / secondValue
    default:
      return secondValue
  }
}

function App() {
  const [displayValue, setDisplayValue] = useState('0')
  const [storedValue, setStoredValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplayValue(String(digit))
      setWaitingForOperand(false)
      return
    }

    setDisplayValue((currentValue) => {
      return currentValue === '0' ? String(digit) : currentValue + digit
    })
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.')
      setWaitingForOperand(false)
      return
    }

    if (!displayValue.includes('.')) {
      setDisplayValue((currentValue) => currentValue + '.')
    }
  }

  const clearAll = () => {
    setDisplayValue('0')
    setStoredValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const toggleSign = () => {
    const nextValue = Number(displayValue) * -1
    setDisplayValue(formatValue(nextValue))
  }

  const applyPercentage = () => {
    const nextValue = Number(displayValue) / 100
    setDisplayValue(formatValue(nextValue))
  }

  const handleOperator = (nextOperator) => {
    const inputValue = Number(displayValue)

    if (storedValue === null) {
      setStoredValue(inputValue)
    } else if (operator) {
      const result = compute(storedValue, inputValue, operator)

      if (!Number.isFinite(result)) {
        setDisplayValue('Error')
        setStoredValue(null)
        setOperator(null)
        setWaitingForOperand(true)
        return
      }

      setDisplayValue(formatValue(result))
      setStoredValue(result)
    }

    setOperator(nextOperator)
    setWaitingForOperand(true)
  }

  const calculateResult = () => {
    if (operator === null || storedValue === null) {
      return
    }

    const result = compute(storedValue, Number(displayValue), operator)

    if (!Number.isFinite(result)) {
      setDisplayValue('Error')
      setStoredValue(null)
      setOperator(null)
      setWaitingForOperand(true)
      return
    }

    setDisplayValue(formatValue(result))
    setStoredValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const buttons = [
    { label: 'C', action: clearAll, type: 'secondary' },
    { label: '+/-', action: toggleSign, type: 'secondary' },
    { label: '%', action: applyPercentage, type: 'secondary' },
    { label: '/', action: () => handleOperator('/'), type: 'operator' },
    { label: '7', action: () => inputDigit(7) },
    { label: '8', action: () => inputDigit(8) },
    { label: '9', action: () => inputDigit(9) },
    { label: '*', action: () => handleOperator('*'), type: 'operator' },
    { label: '4', action: () => inputDigit(4) },
    { label: '5', action: () => inputDigit(5) },
    { label: '6', action: () => inputDigit(6) },
    { label: '-', action: () => handleOperator('-'), type: 'operator' },
    { label: '1', action: () => inputDigit(1) },
    { label: '2', action: () => inputDigit(2) },
    { label: '3', action: () => inputDigit(3) },
    { label: '+', action: () => handleOperator('+'), type: 'operator' },
    { label: '0', action: () => inputDigit(0), wide: true },
    { label: '.', action: inputDecimal },
    { label: '=', action: calculateResult, type: 'equals', wide: true },
  ]

  return (
    <main className="app-shell">
      <div className="calculator">
        <div className="status-bar">
          <span>Calculator</span>
          <span className="status-dot" aria-label="Status online" />
        </div>

        <div className="display" aria-live="polite">
          {displayValue}
        </div>

        <div className="keypad">
          {buttons.map(({ label, action, type, wide }) => (
            <button
              key={label}
              type="button"
              className={`key ${type ?? ''} ${wide ? 'wide' : ''}`.trim()}
              onClick={action}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App