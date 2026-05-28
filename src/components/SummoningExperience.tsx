'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { activateTotem } from '@/lib/totem'

interface SummoningExperienceProps {
  id: string
  name: string
  color: string
}

export default function SummoningExperience({ id, name, color }: SummoningExperienceProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<'intro' | 'sigil' | 'complete'>('intro')

  useEffect(() => {
    // Intro phase: 1.5s
    const introTimer = setTimeout(() => setPhase('sigil'), 1500)

    // Sigil phase: 2.5s
    const sigilTimer = setTimeout(() => setPhase('complete'), 4000)

    // Redirect after completion: 1.5s
    const redirectTimer = setTimeout(() => {
      activateTotem(id)
      router.push(`/chronicle/${id}`)
    }, 5500)

    return () => {
      clearTimeout(introTimer)
      clearTimeout(sigilTimer)
      clearTimeout(redirectTimer)
    }
  }, [id, router])

  return (
    <div className="summoning-container">
      {/* Animated background particles */}
      <div className="summoning-particles">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--delay': `${i * 0.15}s`,
              '--duration': `${3 + Math.random() * 2}s`,
              '--color': color,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Ambient glow backdrop */}
      <div
        className="summoning-glow"
        style={{ '--glow-color': color } as React.CSSProperties}
      />

      {/* Main content */}
      <div className="summoning-content">
        {/* Intro phase: mysterious text */}
        {phase === 'intro' && (
          <div className="fade-in-out">
            <div className="summoning-text intro-text">
              A presence awakens...
            </div>
          </div>
        )}

        {/* Sigil phase: animated sigil + glow */}
        {(phase === 'sigil' || phase === 'complete') && (
          <div className={`fade-in ${phase === 'complete' ? 'fade-out' : ''}`}>
            <div
              className="summoning-sigil"
              style={{
                '--sigil-color': color,
              } as React.CSSProperties}
            >
              ◈
            </div>
          </div>
        )}

        {/* Name reveal */}
        {phase !== 'intro' && (
          <div className={`fade-in ${phase === 'complete' ? 'slide-up' : ''}`}>
            <div className="summoning-name">
              {name}
            </div>
          </div>
        )}

        {/* Completion text */}
        {phase === 'complete' && (
          <div className="slide-up-delay">
            <div className="summoning-text complete-text">
              ✦ Totem Awakened ✦
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      <div className="summoning-loading">
        <div className="loading-bar" style={{ '--load-color': color } as React.CSSProperties} />
      </div>
    </div>
  )
}
