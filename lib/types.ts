export type Mode = 'time' | 'words' | 'code' | 'custom' | 'precision' | 'meditation' | 'focus'

export type Session = {
  id: string
  createdAt: string
  mode: Mode
  duration?: number
  wordCount?: number
  language: string
  difficulty: 'easy' | 'medium' | 'hard'
  rawWpm: number
  netWpm: number
  cpm: number
  accuracy: number
  consistency: number
  typedChars: number
  correctChars: number
  wrongChars: number
  backspaces: number
  timeline: Array<{ t: number; wpm: number; acc: number }>
  errorMap: Record<string, number>
}
