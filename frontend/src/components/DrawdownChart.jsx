import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      <span className="text-red-400 font-mono font-semibold">
        {payload[0]?.value?.toFixed(2)}%
      </span>
    </div>
  )
}

export default function DrawdownChart({ drawdown, strategyName }) {
  if (!drawdown?.length) return null

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-gray-200 mb-4">Drawdown — {strategyName}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={drawdown} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false}
            tickFormatter={(v) => v.slice(0, 7)} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false}
            tickFormatter={(v) => `${v.toFixed(0)}%`} width={45} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" name="Drawdown (%)" stroke="#ef4444"
            strokeWidth={1.5} fill="url(#ddGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
