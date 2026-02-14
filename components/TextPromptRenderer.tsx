export function TextPromptRenderer({ prompt, typed }: { prompt: string; typed: string }) {
  return (
    <div className="panel text-xl leading-8 font-mono break-words min-h-[180px]">
      {prompt.split('').map((char, i) => {
        const t = typed[i]
        const isCurrent = i === typed.length
        let cls = 'text-white/50'
        if (t === undefined) cls = 'text-white/50'
        else if (t === char) cls = 'text-emerald-300'
        else cls = 'bg-red-500/30 underline text-red-200'
        return (
          <span key={i} className={`${cls} ${isCurrent ? 'border-l border-accent animate-pulse' : ''}`}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </div>
  )
}
