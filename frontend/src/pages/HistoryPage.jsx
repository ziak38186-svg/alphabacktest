import { useState, useEffect } from "react"
import { getHistory } from "../services/api"
import { Clock, TrendingUp, TrendingDown } from "lucide-react"

export default function HistoryPage() {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistory(50)
      setRuns(data.runs || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const strategyColor = (strategy) => {
    if (strategy === "momentum") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    if (strategy === "sentiment") return "text-blue-400 bg-blue-500/10 border-blue-500/30"
    return "text-amber-400 bg-amber-500/10 border-amber-500/30"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading history...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
        Failed to load history: {error}
      </div>
    )
  }

  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Clock className="w-10 h-10 mb-3 opacity-40" />
        <p>No backtest runs yet.</p>
        <p className="text-sm">Run a backtest to see history here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Backtest History</h2>
        <button
          onClick={loadHistory}
          className="text-sm text-gray-400 hover:text-gray-200 px-3 py-1.5 rounded-lg border border-gray-800 hover:bg-gray-800 transition"
        >
          Refresh
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800/50 text-gray-400">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Strategy</th>
              <th className="text-right px-4 py-3 font-medium">CAGR</th>
              <th className="text-right px-4 py-3 font-medium">Sharpe</th>
              <th className="text-right px-4 py-3 font-medium">Max DD</th>
              <th className="text-right px-4 py-3 font-medium">Win %</th>
              <th className="text-right px-4 py-3 font-medium">Trades</th>
              <th className="text-right px-4 py-3 font-medium">Final Capital</th>
              <th className="text-right px-4 py-3 font-medium">Run At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {runs.map((run) => (
              <tr key={run.id} className="hover:bg-gray-800/30 transition">
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${strategyColor(run.strategy)}`}>
                    {run.strategy}
                  </span>
                </td>
                <td className="text-right px-4 py-3">
                  <span className={run.cagr >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {run.cagr != null ? `${run.cagr.toFixed(2)}%` : "-"}
                  </span>
                </td>
                <td className="text-right px-4 py-3 text-gray-300">
                  {run.sharpe_ratio != null ? run.sharpe_ratio.toFixed(3) : "-"}
                </td>
                <td className="text-right px-4 py-3 text-red-400">
                  {run.max_drawdown != null ? `${run.max_drawdown.toFixed(2)}%` : "-"}
                </td>
                <td className="text-right px-4 py-3 text-gray-300">
                  {run.win_rate != null ? `${run.win_rate.toFixed(1)}%` : "-"}
                </td>
                <td className="text-right px-4 py-3 text-gray-300">
                  {run.total_trades ?? "-"}
                </td>
                <td className="text-right px-4 py-3 text-gray-300">
                  {run.final_capital != null ? `Rs ${run.final_capital.toLocaleString()}` : "-"}
                </td>
                <td className="text-right px-4 py-3 text-gray-500 text-xs">
                  {new Date(run.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
