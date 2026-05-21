import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'

const STRATEGY_COLORS = {
  'Momentum Only': '#10b981',
  'Sentiment Only': '#3b82f6',
  'Hybrid ML': '#f59e0b',
}

function formatINR(val) {
  if (val >= 1_00_000) return `₹${(val / 1_00_000).toFixed(1)}L`
  if (val >= 1_000) return `₹${(val / 1_000).toFixed(1)}K`
  return `₹${val}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-mono font-semibold" style={{ color: p.color }}>
            {formatINR(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function EquityChart({ equityCurve, strategyName, compareData }) {
  const color = STRATEGY_COLORS[strategyName] || '#10b981'

  if (compareData) {
    const strategyNames = Object.keys(compareData)
    const allDates = [
      ...new Set(
        strategyNames.flatMap((n) => compareData[n].equity_curve.map((p) => p.date))
      ),
    ].sort()

    const combined = allDates.map((date) => {
      const point = { date }
      strategyNames.forEach((name) => {
        const found = compareData[name].equity_curve.find((p) => p.date === date)
        if (found) point[name] = found.value
      })
      return point
    })

    const initialCapital = combined[0]
      ? Math.min(...strategyNames.map((n) => combined[0][n] || Infinity))
      : 100000

    return (
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-200 mb-4">Strategy Comparison — Equity Curves</h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={combined} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              {strategyNames.map((name, i) => {
                const c = Object.values(STRATEGY_COLORS)[i] || '#888'
                return (
                  <linearGradient key={name} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                )
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false}
              tickFormatter={(v) => v.slice(0, 7)} interval="preserveStartEnd" />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false}
              tickFormatter={formatINR} width={65} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
            <ReferenceLine y={initialCapital} stroke="#374151" strokeDasharray="4 4" />
            {strategyNames.map((name, i) => {
              const c = Object.values(STRATEGY_COLORS)[i] || '#888'
              return (
                <Area key={name} type="monotone" dataKey={name} stroke={c} strokeWidth={2}
                  fill={`url(#grad-${i})`} dot={false} activeDot={{ r: 4 }} connectNulls />
              )
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (!equityCurve?.length) return null

  const initialCapital = equityCurve[0]?.value || 100000

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-gray-200 mb-4">Equity Curve — {strategyName}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={equityCurve} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false}
            tickFormatter={(v) => v.slice(0, 7)} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false}
            tickFormatter={formatINR} width={65} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={initialCapital} stroke="#374151" strokeDasharray="4 4"
            label={{ value: 'Initial', fill: '#6b7280', fontSize: 10 }} />
          <Area type="monotone" dataKey="value" name={strategyName} stroke={color}
            strokeWidth={2} fill="url(#equityGrad)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
