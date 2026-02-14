'use client'

import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark')
  const [fontSize, setFontSize] = useState(18)
  const [sound, setSound] = useState(false)

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
  }, [fontSize])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="panel space-y-3 max-w-xl">
        <label className="flex items-center justify-between">Theme
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bg-black/30 p-2 rounded">
            <option value="dark">Dark</option>
            <option value="light">Light (preview)</option>
          </select>
        </label>
        <label className="flex items-center justify-between">Font size
          <input type="range" min={14} max={24} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
        </label>
        <label className="flex items-center justify-between">Sound effects
          <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
        </label>
      </div>
      <p className="text-white/70 text-sm">Theme toggle and dyslexic-friendly font can be expanded with a persisted preferences store.</p>
    </div>
  )
}
