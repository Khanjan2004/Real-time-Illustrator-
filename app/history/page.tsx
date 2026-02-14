'use client'

import { getSessions } from '@/lib/storage'
import { Session } from '@/lib/types'
import { useEffect, useMemo, useState } from 'react'

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [modeFilter, setModeFilter] = useState('all')

  useEffect(() => setSessions(getSessions()), [])

  const filtered = useMemo(
    () => sessions.filter((s) => modeFilter === 'all' || s.mode === modeFilter),
    [sessions, modeFilter]
  )

  const avg = filtered.length ? filtered.reduce((a, b) => a + b.netWpm, 0) / filtered.length : 0
  const best = filtered.length ? Math.max(...filtered.map((s) => s.netWpm)) : 0

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Session History</h1>
      <div className="panel flex items-center gap-3">
        <label>Filter mode</label>
        <select className="bg-black/30 rounded p-2" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="time">Time</option><option value="words">Words</option><option value="code">Code</option>
          <option value="custom">Custom</option><option value="precision">Precision</option><option value="meditation">Meditation</option><option value="focus">Focus</option>
        </select>
        <span className="text-sm text-white/70">Best: {best.toFixed(1)} | Avg: {avg.toFixed(1)}</span>
      </div>
      <div className="space-y-2">
        {filtered.map((s) => (
          <div key={s.id} className="panel flex justify-between text-sm">
            <span>{new Date(s.createdAt).toLocaleString()} • {s.mode} • {s.language}</span>
            <span>{s.netWpm.toFixed(1)} WPM • {s.accuracy.toFixed(1)}%</span>
          </div>
        ))}
        {!filtered.length ? <div className="panel">No sessions.</div> : null}
      </div>
    </div>
  )
}
