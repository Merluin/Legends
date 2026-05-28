import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Legends — Spirits that live through circles of play',
  description: 'A hybrid physical/digital system of itinerant privileges for board games.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/" className="logo">LEGENDS</a>
          <div className="nav-links">
            <a href="/explore">Explore</a>
            <a href="/faq">FAQ</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
