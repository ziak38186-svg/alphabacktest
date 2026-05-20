import { TrendingUp, TrendingDown, BarChart2, Target, DollarSign, Activity } from 'lucide-react'
import clsx from 'clsx'

function MetricCard({ label, value, icon: Icon, color, suffix = '', prefix = '' }) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-2">
        <span className="metric-label">{label}</span>
        <div className={clsx('p-1.5 rounded-md', color?.bg || 'bg-gray-800')}>
          <Icon className={clsx('w-3.5 h-3.5', color?.icon || 'text-gray-400')} />
        </div>
      </div>
      <div className={clsx('metric-value', color?.text || 'text-white')}>
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
    </div>
  )
}

export default function MetricsGrid({ metrics, strategyName }) {
  if (!metrics) return null

  const cagrPositive = metrics.CAGR >= 0
  const ddColor = metrics.Max_Drawdown < -20
    ? { bg: 'bg-red-500/10', icon: 'text-red-400', text: 'text-red-400' }
    : { bg: 'bg-amber-500/10', icon: 'text-amber-400', text: 'text-amber-400' }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-200">Performance Metrics</h3>
        {strategyName && (
          <span className="text-xs px-2 py-1 rounded-md bg-gray-800 text-gray-400 border border-gray-700">
            {strategyName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="CAGR"
          value={metrics.CAGR?.toFixed(2)}
          icon={cagrPositive ? TrendingUp : TrendingDown}
          suffix="%"
          color={cagrPositive
            ? { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', text: 'text-emerald-400' }
            : { bg: 'bg-red-500/10', icon: 'text-red-400', text: 'text-red-400' }}
        />
        <MetricCard
          label="Sharpe Ratio"
          value={metrics.Sharpe?.toFixed(3)}
          icon={Activity}
          color={metrics.Sharpe >= 1
            ? { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', text: 'text-emerald-400' }
            : { bg: 'bg-gray-800', icon: 'text-gray-400', text: 'text-gray-200' }}
        />
        <MetricCard
          label="Max Drawdown"
          value={metrics.Max_Drawdown?.toFixed(2)}
          icon={TrendingDown}
          suffix="%"
          color={ddColor}
        />
        <MetricCard
          label="Win Rate"
          value={metrics.Win_Pct?.toFixed(1)}
          icon={Target}
          suffix="%"
          color={metrics.Win_Pct >= 50
            ? { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', text: 'text-emerald-400' }
            : { bg: 'bg-red-500/10', icon: 'text-red-400', text: 'text-red-400' }}
        />
        <MetricCard
          label="Total Trades"
          value={metrics.Total_Trades}
          icon={BarChart2}
          color={{ bg: 'bg-blue-500/10', icon: 'text-blue-400', text: 'text-blue-300' }}
        />
        <MetricCard
          label="Total PnL"
          value={Math.abs(metrics.Total_PnL).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          icon={DollarSign}
          prefix={metrics.Total_PnL >= 0 ? '₹+' : '₹-'}
          color={metrics.Total_PnL >= 0
            ? { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', text: 'text-emerald-400' }
            : { bg: 'bg-red-500/10', icon: 'text-red-400', text: 'text-red-400' }}
        />
        <MetricCard
          label="Initial Capital"
          value={metrics.Initial_Capital?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          icon={DollarSign}
          prefix="₹"
          color={{ bg: 'bg-gray-800', icon: 'text-gray-400', text: 'text-gray-200' }}
        />
        <MetricCard
          label="Final Capital"
          value={metrics.Final_Capital?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          icon={DollarSign}
          prefix="₹"
          color={metrics.Final_Capital >= metrics.Initial_Capital
            ? { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', text: 'text-emerald-400' }
            : { bg: 'bg-red-500/10', icon: 'text-red-400', text: 'text-red-400' }}
        />
      </div>
    </div>
  )
}
