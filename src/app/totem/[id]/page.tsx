'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { isTotemActivated } from '@/lib/totem'
import SummoningExperience from '@/components/SummoningExperience'
import { PRIVILEGI, type Legend } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface TotemPageProps {
  params: Promise<{ id: string }>
}

export default function TotemPage({ params }: TotemPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [{ id }, setId] = useState<{ id: string }>({ id: '' })
  const [isActivated, setIsActivated] = useState<boolean | null>(null)
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
    setIsActivated(activated)

    // Fetch legend metadata
    supabase
      .from('legends')
      .select('*')
      .eq('id', id.toUpperCase())
      .single()
      .then(({ data }) => {
        if (data) setLegend(data)
      })

    // If already activated, redirect immediately
    if (activated) {
      router.push(`/chronicle/${id}`)
    }
  }, [id, router])

  // If not yet loaded, show nothing (prevents flash)
  if (isActivated === null || !legend) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Invisible loading state - no flash */}
      </div>
    )
  }

  // If returning visitor, they've already been redirected
  if (isActivated) {
    return null
  }

  // First-time visitor: show summoning experience
  const color = PRIVILEGI[legend.tipo as keyof typeof PRIVILEGI].color

  return (
    <SummoningExperience
      id={id}
      name={legend.nome}
      color={color}
    />
  )
}
