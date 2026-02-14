import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Typing Test Arena',
  description: 'Professional typing test web app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex gap-4 text-sm">
            <Link href="/">Test</Link>
            <Link href="/results">Results</Link>
            <Link href="/history">History</Link>
            <Link href="/settings">Settings</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
