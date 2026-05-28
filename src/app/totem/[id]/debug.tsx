'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isTotemActivated } from '@/lib/totem'
import { supabase } from '@/lib/supabase'

interface TotemDebugPageProps {
  params: Promise<{ id: string }>
}

export default function TotemDebugPage({ params }: TotemDebugPageProps) {
  const router = useRouter()
  const [{ id }, setId] = useState<{ id: string }>({ id: '' })
  const [debug, setDebug] = useState<string[]>([])

  useEffect(() => {
    params.then(setId)
  }, [params])

  useEffect(() => {
    if (!id) return

    const logs: string[] = []

    // Check localStorage
    const activated = isTotemActivated(id)
    logs.push(`✓ localStorage check: activated = ${activated}`)

    if (activated) {
      logs.push(`⚠️ Already activated - would redirect to /chronicle/${id}`)
      setDebug(logs)
      return
    }

    logs.push(`✓ First time visitor`)

    // Fetch from Supabase
    logs.push(`→ Fetching from Supabase...`)
    setDebug([...logs])

    supabase
      .from('legends')
      .select('*')
      .eq('id', id.toUpperCase())
      .single()
      .then(({ data, error }) => {
        if (error) {
          logs.push(`❌ Supabase Error: ${error.message}`)
        } else if (data) {
          logs.push(`✓ Found legend: ${data.nome}`)
          logs.push(`✓ Type: ${data.tipo}`)
          logs.push(`✓ Ready to show summoning animation`)
        } else {
          logs.push(`❌ Legend not found in database`)
        }
        setDebug([...logs])
      })
  }, [id])

  return (
    <div style={{
      background: 'var(--bg)',
      color: 'var(--text)',
      minHeight: '100vh',
      padding: '40px 24px',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
    }}>
      <div className="wrap">
        <h1 className="display" style={{ fontSize: '28px', marginBottom: '24px' }}>
          🐛 Debug: Totem {id.toUpperCase()}
        </h1>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          padding: '20px',
          marginBottom: '24px',
        }}>
          {debug.length === 0 ? (
            <div style={{ color: 'var(--muted)' }}>Loading...</div>
          ) : (
            debug.map((log, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                {log}
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem(`totem_${id}`)
            window.location.reload()
          }}
          className="btn btn-primary"
          style={{ marginRight: '12px' }}
        >
          Clear localStorage & Reload
        </button>

        <button
          onClick={() => window.location.href = `/totem/${id}`}
          className="btn btn-ghost"
        >
          Back to Totem
        </button>

        <div style={{ marginTop: '32px', color: 'var(--muted)', fontSize: '14px' }}>
          <p>📍 URL: /totem/{id}/debug</p>
          <p>💾 localStorage key: totem_{id}</p>
          <p>🔍 Check browser console (F12) for more details</p>
        </div>
      </div>
    </div>
  )
}
