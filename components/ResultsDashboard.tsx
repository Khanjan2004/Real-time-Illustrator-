'use client'

import { Session } from '@/lib/types'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function ResultsDashboard({ session }: { session: Session }) {
  const errorEntries = Object.entries(session.errorMap).sort((a, b) => b[1] - a[1]).slice(0, 10)
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-4 gap-3">
        <Metric title="Raw WPM" value={session.rawWpm.toFixed(1)} />
        <Metric title="Net WPM" value={session.netWpm.toFixed(1)} />
        <Metric title="Accuracy" value={`${session.accuracy.toFixed(1)}%`} />
        <Metric title="Consistency" value={session.consistency.toFixed(0)} />
      </div>
      <div className="panel h-72">
        <h3 className="mb-3 font-semibold">Speed Timeline</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={session.timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="t" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="wpm" stroke="#5eead4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="panel">
        <h3 className="mb-3 font-semibold">Error Heatmap (Top 10)</h3>
        <div className="grid grid-cols-5 gap-2">
          {errorEntries.length === 0 ? <p className="text-white/70 text-sm">No errors 🎉</p> : null}
          {errorEntries.map(([ch, count]) => (
            <div key={ch} className="rounded-lg border border-red-400/40 p-2 text-center bg-red-500/20">
              <div className="font-mono text-lg">{ch === ' ' ? '␠' : ch}</div>
              <div className="text-xs">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Metric({ title, value }: { title: string; value: string }) {
  return <div className="panel"><div className="text-xs text-white/60">{title}</div><div className="text-2xl font-bold">{value}</div></div>
}
