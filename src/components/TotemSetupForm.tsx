'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { activateTotem } from '@/lib/totem'
import { PRIVILEGI } from '@/lib/supabase'

interface TotemSetupFormProps {
  id: string
  color: string
}

export default function TotemSetupForm({ id, color }: TotemSetupFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    creatore: '',
    luogo_creazione: '',
    possessore_attuale: '',
    tipo: 'primo' as const,
    autenticato: false,
  })

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Update legend in Supabase
      const { error: updateError } = await supabase
        .from('legends')
        .update(formData)
        .eq('id', id.toUpperCase())

      if (updateError) throw updateError

      // Record activation
      activateTotem(id)

      // Redirect to chronicle
      router.push(`/chronicle/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save totem')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', color }}>
            ◈
          </div>
          <h1 className="display" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Awaken the Totem
          </h1>
          <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
            Define the spirit that has been summoned
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Spirit Name */}
          <div className="field">
            <label>Spirit Name *</label>
            <input
              type="text"
              placeholder="e.g., Spirit of the Abyss"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
            />
          </div>

          {/* Summoner Name */}
          <div className="field">
            <label>Your Name (Summoner) *</label>
            <input
              type="text"
              placeholder="e.g., The First Summoner"
              value={formData.creatore}
              onChange={(e) => handleChange('creatore', e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="field">
            <label>Where was it summoned? *</label>
            <input
              type="text"
              placeholder="e.g., Dark Hall, Scarlet Tower"
              value={formData.luogo_creazione}
              onChange={(e) => handleChange('luogo_creazione', e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div className="field">
            <label>Privilege Type *</label>
            <select
              value={formData.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
            >
              <option value="primo">♔ FIRST — Keeper decides who opens the game</option>
              <option value="colore">◈ COLOUR — Keeper chooses their faction</option>
              <option value="gioco">⚄ GAME — Keeper chooses the game of the evening</option>
              <option value="coppia">❧ BOND — Keeper chooses their partner</option>
            </select>
          </div>

          {/* Current Keeper */}
          <div className="field">
            <label>Current Keeper</label>
            <input
              type="text"
              placeholder="Who holds this totem now? (default: Awaiting Bearer)"
              value={formData.possessore_attuale}
              onChange={(e) => handleChange('possessore_attuale', e.target.value)}
            />
          </div>

          {/* Authenticated */}
          <div className="field" style={{ marginBottom: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.autenticato}
                onChange={(e) => handleChange('autenticato', e.target.checked)}
                style={{ width: 'auto', margin: 0, padding: 0 }}
              />
              <span>This is an authenticated/verified legend</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-box" style={{ marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Saving...' : '✦ Chronicle This Totem'}
          </button>

          <p style={{
            fontSize: '13px',
            color: 'var(--dim)',
            textAlign: 'center',
            marginTop: '20px',
            fontStyle: 'italic',
          }}>
            Once saved, this totem's chronicle will be permanent and shared with all visitors.
          </p>
        </form>
      </div>
    </div>
  )
}
