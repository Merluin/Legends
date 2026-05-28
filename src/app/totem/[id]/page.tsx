'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isTotemActivated } from '@/lib/totem'
import SummoningExperience from '@/components/SummoningExperience'
import TotemSetupForm from '@/components/TotemSetupForm'
import { PRIVILEGI, type Legend } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface TotemPageProps {
  params: Promise<{ id: string }>
}

type PagePhase = 'loading' | 'summoning' | 'setup'

export default function TotemPage({ params }: TotemPageProps) {
  const router = useRouter()
  const [{ id }, setId] = useState<{ id: string }>({ id: '' })
  const [phase, setPhase] = useState<PagePhase>('loading')
  const [legend, setLegend] = useState<Legend | null>(null)

  // Unwrap params promise
  useEffect(() => {
    params.then(setId)
  }, [params])

  // Check activation state and fetch legend data
  useEffect(() => {
    if (!id) return

    // Check if this totem has been activated before
    const activated = isTotemActivated(id)

    if (activated) {
      // Returning visitor: redirect immediately
      router.push(`/chronicle/${id}`)
      return
    }

    // First-time visitor: fetch legend and show summoning
    supabase
      .from('legends')
      .select('*')
      .eq('id', id.toUpperCase())
      .single()
      .then(({ data }) => {
        if (data) {
          setLegend(data)
          setPhase('summoning')
        }
      })
  }, [id, router])

  // If not yet loaded, show nothing (prevents flash)
  if (phase === 'loading' || !legend) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Invisible loading state - no flash */}
      </div>
    )
  }

  const color = PRIVILEGI[legend.tipo as keyof typeof PRIVILEGI].color

  return (
    <>
      {/* Show summoning animation first */}
      {phase === 'summoning' && (
        <div>
          <SummoningExperience
            id={id}
            name={legend.nome}
            color={color}
            onComplete={() => setPhase('setup')}
          />
          {/* Skip button for testing */}
          <button
            onClick={() => setPhase('setup')}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              zIndex: 10000,
            }}
          >
            Skip to Form →
          </button>
        </div>
      )}

      {/* After animation, show setup form */}
      {phase === 'setup' && (
        <TotemSetupForm
          id={id}
          color={color}
        />
      )}
    </>
  )
}
