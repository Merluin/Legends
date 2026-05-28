'use client'

// Vercel rebuild trigger
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SummoningExperience from '@/components/SummoningExperience'
import TotemSetupForm from '@/components/TotemSetupForm'
import LogAwakeningModal from '@/components/LogAwakeningModal'
import { PRIVILEGI, type Legend } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface LegendPageProps {
  params: Promise<{ id: string }>
}

type PagePhase = 'loading' | 'summoning' | 'setup' | 'log-entry'

export default function LegendPage({ params }: LegendPageProps) {
  const router = useRouter()
  const [{ id }, setId] = useState<{ id: string }>({ id: '' })
  const [phase, setPhase] = useState<PagePhase>('loading')
  const [legend, setLegend] = useState<Legend | null>(null)

  // Unwrap params promise
  useEffect(() => {
    params.then(setId)
  }, [params])

  // Fetch legend and determine phase based on setup status
  useEffect(() => {
    if (!id) return

    // Fetch legend data
    supabase
      .from('legends')
      .select('*')
      .eq('id', id.toUpperCase())
      .single()
      .then(({ data }) => {
        if (data) {
          setLegend(data)
          // If legend hasn't been set up yet (no nome): show summoning
          // If legend is already set up: show log entry
          setPhase(data.nome ? 'log-entry' : 'summoning')
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
      {/* First visit: show summoning animation */}
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

      {/* First visit: setup form to create spirit */}
      {phase === 'setup' && (
        <TotemSetupForm
          id={id}
          color={color}
        />
      )}

      {/* Return visits: log entry form to record game events */}
      {phase === 'log-entry' && (
        <LogAwakeningModal
          legendId={id}
          spiritName={legend.nome}
          color={color}
          onClose={() => router.push(`/chronicle/${id}`)}
          onSave={() => router.push(`/chronicle/${id}`)}
          isReturnVisit={true}
        />
      )}
    </>
  )
}
