import { Mode } from '@/lib/types'

const MODES: Mode[] = ['time', 'words', 'code', 'custom', 'precision', 'meditation', 'focus']

export function ModeSelector({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="panel flex flex-wrap gap-2">
      {MODES.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-3 py-1 rounded-lg border text-sm ${mode === m ? 'bg-accent text-black border-accent' : 'border-white/20'}`}
        >
          {m}
        </button>
      ))}
    </div>
  )
}
