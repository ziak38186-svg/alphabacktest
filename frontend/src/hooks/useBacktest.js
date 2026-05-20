import { useState, useCallback } from 'react'
import { runBacktest, compareStrategies } from '../services/api'

export function useBacktest() {
  const [result, setResult] = useState(null)
  const [compareResult, setCompareResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [elapsed, setElapsed] = useState(null)

  const execute = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    setResult(null)
    const t0 = performance.now()
    try {
      const data = await runBacktest(params)
      setResult(data)
      setElapsed(((performance.now() - t0) / 1000).toFixed(2))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const compare = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    setCompareResult(null)
    const t0 = performance.now()
    try {
      const data = await compareStrategies(params)
      setCompareResult(data)
      setElapsed(((performance.now() - t0) / 1000).toFixed(2))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setCompareResult(null)
    setError(null)
    setElapsed(null)
  }, [])

  return { result, compareResult, loading, error, elapsed, execute, compare, reset }
}
