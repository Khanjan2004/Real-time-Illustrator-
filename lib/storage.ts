import { Session } from './types'

const KEY = 'typing-arena-sessions'
const LAST_KEY = 'typing-arena-last'

export function saveSession(session: Session) {
  if (typeof window === 'undefined') return
  const current = getSessions()
  const next = [session, ...current].slice(0, 100)
  localStorage.setItem(KEY, JSON.stringify(next))
  localStorage.setItem(LAST_KEY, JSON.stringify(session))
}

export function getSessions(): Session[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Session[]
  } catch {
    return []
  }
}

export function getLastSession(): Session | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(LAST_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}
