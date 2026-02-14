'use client'

import Link from 'next/link'
import { ResultsDashboard } from '@/components/ResultsDashboard'
import { getLastSession } from '@/lib/storage'
import { useEffect, useState } from 'react'
import { Session } from '@/lib/types'

export default function ResultsPage() {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => setSession(getLastSession()), [])

  if (!session) {
    return <div className="panel">No finished session yet. <Link href="/" className="underline">Start a test</Link>.</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Results</h1>
      <ResultsDashboard session={session} />
      <div className="flex gap-2">
        <Link className="px-3 py-2 rounded bg-accent text-black" href="/">Retry</Link>
        <button onClick={async () => { try { await navigator.clipboard.writeText(`I scored ${session.netWpm.toFixed(0)} WPM!`) } catch {} }} className="px-3 py-2 rounded border border-white/20">Share</button>
      </div>
    </div>
  )
}
