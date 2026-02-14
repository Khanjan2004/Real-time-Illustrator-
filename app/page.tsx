'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ModeSelector } from '@/components/ModeSelector'
import { LiveStatsBar } from '@/components/LiveStatsBar'
import { TextPromptRenderer } from '@/components/TextPromptRenderer'
import { saveSession } from '@/lib/storage'
import { Mode, Session } from '@/lib/types'
import { useRouter } from 'next/navigation'

const LANG_PROMPTS: Record<string, string> = {
  en: 'The quick brown fox jumps over the lazy dog while typing with calm focus and clean rhythm.',
  uz: 'Bugun barqaror va aniq yozish orqali tezlikni oshiramiz, har bir belgi muhim va nazorat ostida.',
  ru: 'Стабильный ритм печати помогает улучшить точность, скорость и уверенность в каждом сеансе.',
  ar: 'الكتابة الهادئة والدقيقة تساعدك على تحسين السرعة والثبات مع مرور الوقت.'
}

const CODE_PROMPTS = [
  'for (let i = 0; i < 10; i++) { console.log(i); }',
  'SELECT id, name FROM users WHERE active = 1 ORDER BY created_at DESC;',
  'function Card(){ return <div className="card">Hello</div>; }'
]

export default function HomePage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('time')
  const [language, setLanguage] = useState<'en' | 'uz' | 'ru' | 'ar'>('en')
  const [duration, setDuration] = useState(60)
  const [wordCount, setWordCount] = useState(25)
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const [timeline, setTimeline] = useState<Array<{ t: number; wpm: number; acc: number }>>([])
  const [backspaces, setBackspaces] = useState(0)
  const [difficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [prompt, setPrompt] = useState(LANG_PROMPTS.en)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const finishedRef = useRef(false)

  const elapsedSeconds = startedAt ? Math.max(1, Math.floor((now - startedAt) / 1000)) : 0
  const typedChars = typed.length
  const correctChars = useMemo(() => prompt.split('').filter((c, i) => typed[i] === c).length, [prompt, typed])
  const wrongChars = Math.max(typedChars - correctChars, 0)
  const minutes = Math.max(elapsedSeconds / 60, 1 / 60)
  const rawWpm = (typedChars / 5) / minutes
  const netWpm = Math.max(((correctChars - wrongChars) / 5) / minutes, 0)
  const cpm = typedChars / minutes
  const accuracy = (correctChars / Math.max(typedChars, 1)) * 100
  const consistency = Math.max(0, Math.min(100, 100 - stdDev(timeline.map((t) => t.wpm)) * 2))

  const errors = useMemo(() => {
    const map: Record<string, number> = {}
    prompt.split('').forEach((c, i) => {
      if (typed[i] && typed[i] !== c) map[c] = (map[c] || 0) + 1
    })
    return map
  }, [prompt, typed])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!startedAt) return
    const interval = setInterval(() => {
      setTimeline((prev) => [
        ...prev,
        {
          t: Math.max(1, Math.floor((Date.now() - startedAt) / 1000)),
          wpm: netWpm,
          acc: accuracy,
        },
      ])
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt, netWpm, accuracy])

  useEffect(() => {
    finishedRef.current = false
    setTyped('')
    setTimeline([])
    setStartedAt(null)
    setBackspaces(0)

    if (mode === 'code') {
      setPrompt(CODE_PROMPTS[Math.floor(Math.random() * CODE_PROMPTS.length)])
      return
    }

    if (mode === 'custom') {
      setPrompt('Paste your own custom prompt from settings (MVP uses this placeholder custom sentence).')
      return
    }

    if (mode === 'precision') {
      setPrompt('Type slowly and chase perfect accuracy over speed.')
      return
    }

    if (mode === 'meditation') {
      setPrompt('Breathe, type softly, keep a stable rhythm and reduce error spikes.')
      return
    }

    setPrompt(LANG_PROMPTS[language])
  }, [mode, language])

  useEffect(() => {
    if (!startedAt || finishedRef.current) return

    if (mode === 'time' && elapsedSeconds >= duration) {
      finishSession()
      return
    }

    if (mode === 'words' && typed.trim().split(/\s+/).filter(Boolean).length >= wordCount) {
      finishSession()
    }
  }, [startedAt, mode, elapsedSeconds, duration, typed, wordCount])

  function finishSession() {
    if (!startedAt || finishedRef.current) return
    finishedRef.current = true

    const session: Session = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      mode,
      duration,
      wordCount,
      language,
      difficulty,
      rawWpm,
      netWpm,
      cpm,
      accuracy,
      consistency,
      typedChars,
      correctChars,
      wrongChars,
      backspaces,
      timeline,
      errorMap: errors,
    }

    saveSession(session)
    setStartedAt(null)
    router.push('/results')
  }

  function onInput(next: string) {
    if (!startedAt && next.length > 0) setStartedAt(Date.now())
    if (next.length < typed.length) setBackspaces((b) => b + (typed.length - next.length))
    setTyped(next)
  }

  return (
    <div className="space-y-4">
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
        Typing Test Arena
      </motion.h1>

      <div className="grid gap-3 md:grid-cols-3">
        <ModeSelector mode={mode} onChange={setMode} />
        <div className="panel flex items-center gap-2">
          <label className="text-sm">Language</label>
          <select className="rounded bg-black/30 p-2" value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'uz' | 'ru' | 'ar')}>
            <option value="en">English</option>
            <option value="uz">O&apos;zbek</option>
            <option value="ru">Русский</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        <div className="panel flex items-center gap-2">
          <label className="text-sm">Timer</label>
          <select className="rounded bg-black/30 p-2" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={120}>120s</option>
          </select>
          <label className="ml-2 text-sm">Words</label>
          <select className="rounded bg-black/30 p-2" value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <LiveStatsBar wpm={netWpm} cpm={cpm} accuracy={accuracy} errors={wrongChars} consistency={consistency} />

      <div className="space-y-3" onClick={() => inputRef.current?.focus()}>
        <TextPromptRenderer prompt={prompt} typed={typed} />
        <textarea
          ref={inputRef}
          autoFocus
          value={typed}
          onChange={(e) => onInput(e.target.value)}
          className="pointer-events-none absolute opacity-0"
          aria-label="Hidden input capture"
        />
        <div className="panel flex items-center justify-between text-sm">
          <span>{startedAt ? `Elapsed: ${elapsedSeconds}s` : 'Start typing to begin'}</span>
          <div className="space-x-2">
            <button
              onClick={() => {
                finishedRef.current = false
                setTyped('')
                setTimeline([])
                setStartedAt(null)
                setBackspaces(0)
              }}
              className="rounded-lg border border-white/20 px-3 py-1"
            >
              Reset
            </button>
            <button onClick={finishSession} className="rounded-lg bg-accent px-3 py-1 text-black">
              Finish
            </button>
          </div>
        </div>
      </div>

      <div className="panel text-sm text-white/70">
        <p>Realtime Duel, streaks, ghost replay, and analytics lab are listed in the roadmap and can be built next as separate modules.</p>
      </div>
    </div>
  )
}

function stdDev(values: number[]) {
  if (values.length < 2) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}
