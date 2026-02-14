export function LiveStatsBar({ wpm, cpm, accuracy, errors, consistency }: { wpm: number; cpm: number; accuracy: number; errors: number; consistency: number }) {
  const items = [
    ['Net WPM', wpm.toFixed(1)],
    ['CPM', cpm.toFixed(0)],
    ['Accuracy', `${accuracy.toFixed(1)}%`],
    ['Errors', `${errors}`],
    ['Consistency', `${consistency.toFixed(0)}`],
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-5">
      {items.map(([k, v]) => (
        <div key={k} className="panel">
          <div className="text-xs text-white/60">{k}</div>
          <div className="text-xl font-semibold">{v}</div>
        </div>
      ))}
    </div>
  )
}
