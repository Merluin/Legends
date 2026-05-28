'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface LogAwakeningModalProps {
  legendId: string
  spiritName: string
  color: string
  onClose: () => void
  onSave: () => void
  isReturnVisit?: boolean
}

const ADJECTIVES = [
  'Fair Play',
  'Honor',
  'Venerably',
  'Graceful',
  'Valiant',
  'Worthy',
  'Skilled',
  'Noble',
  'Courageous',
  'Defiant',
  'Legendary',
  'Steadfast',
]

export default function LogAwakeningModal({
  legendId,
  spiritName,
  color,
  onClose,
  onSave,
  isReturnVisit = false,
}: LogAwakeningModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAdjectives, setSelectedAdjectives] = useState<string[]>([])

  const [formData, setFormData] = useState({
    keeper: '',
    worthiestLoss: '',
    game: '',
    location: '',
  })

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleAdjective = (adj: string) => {
    setSelectedAdjectives(prev =>
      prev.includes(adj) ? prev.filter(a => a !== adj) : [...prev, adj]
    )
  }

  const generateLogEntry = (): string => {
    const date = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    const adjectiveText =
      selectedAdjectives.length > 0 ? `with ${selectedAdjectives.join(', ')}` : 'valiantly'

    const locations = formData.location ? ` at ${formData.location}` : ''

    const entry = `On ${date}, ${formData.keeper} brought forth the Spirit, seeking glory in ${formData.game}. ${formData.worthiestLoss} faced defeat ${adjectiveText}${locations}. ${spiritName} grew stronger.`

    return entry
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.keeper || !formData.worthiestLoss || !formData.game) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      const logEntry = generateLogEntry()

      const { error: insertError } = await supabase.from('awakenings').insert([
        {
          legend_id: legendId.toUpperCase(),
          tipo: 'passaggio',
          da: formData.keeper,
          a: formData.worthiestLoss,
          gioco: formData.game,
          luogo: formData.location || 'Unknown',
          note: logEntry,
          created_at: new Date().toISOString(),
        },
      ])

      if (insertError) throw insertError

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save log entry')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
        padding: '24px',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: `2px solid ${color}`,
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '40px',
          animation: 'slideUp 0.4s ease-out',
          boxShadow: `0 0 40px ${color}44`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '32px',
              marginBottom: '12px',
              color,
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
          >
            📖
          </div>
          <h2 className="display" style={{ fontSize: '28px', marginBottom: '8px' }}>
            CHRONICLE ENTRY
          </h2>
          <p style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '14px' }}>
            {isReturnVisit
              ? `${spiritName} awakens again...`
              : 'Record this awakening for the ages'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Keeper Name */}
          <div className="field">
            <label>Keeper Name *</label>
            <input
              type="text"
              placeholder="Who awakened the spirit?"
              value={formData.keeper}
              onChange={(e) => handleChange('keeper', e.target.value)}
              required
            />
          </div>

          {/* Worthiest Loss */}
          <div className="field">
            <label>Worthiest Loss (Defeated Player) *</label>
            <input
              type="text"
              placeholder="Who faced defeat?"
              value={formData.worthiestLoss}
              onChange={(e) => handleChange('worthiestLoss', e.target.value)}
              required
            />
          </div>

          {/* Game Name */}
          <div className="field">
            <label>Game Name *</label>
            <input
              type="text"
              placeholder="What game was played?"
              value={formData.game}
              onChange={(e) => handleChange('game', e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="field">
            <label>Location (Optional)</label>
            <input
              type="text"
              placeholder="Where did this occur?"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          {/* Adjectives */}
          <div className="field">
            <label>Describe the Worthiest Loss</label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              {ADJECTIVES.map((adj) => (
                <button
                  key={adj}
                  type="button"
                  onClick={() => toggleAdjective(adj)}
                  style={{
                    padding: '8px 12px',
                    background: selectedAdjectives.includes(adj)
                      ? `${color}33`
                      : 'var(--bg-light)',
                    border: `1px solid ${selectedAdjectives.includes(adj) ? color : 'var(--border)'}`,
                    color: selectedAdjectives.includes(adj) ? color : 'var(--muted)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'Bebas Neue',
                    letterSpacing: '0.05em',
                    transition: 'all 0.15s',
                  }}
                >
                  {selectedAdjectives.includes(adj) ? '✓ ' : ''}
                  {adj}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Entry Preview */}
          <div
            style={{
              background: 'var(--bg)',
              border: `1px solid var(--border)`,
              padding: '16px',
              marginBottom: '24px',
              borderLeft: `3px solid ${color}`,
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--dim)', marginBottom: '8px' }}>
              ENTRY PREVIEW
            </div>
            <div
              style={{
                fontSize: '14px',
                color: 'var(--text)',
                fontStyle: 'italic',
                lineHeight: 1.6,
              }}
            >
              {generateLogEntry()}
            </div>
          </div>

          {/* Error */}
          {error && <div className="error-box" style={{ marginBottom: '24px' }}>{error}</div>}

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Recording...' : '✦ Record Entry'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              style={{ flex: 1 }}
              disabled={loading}
            >
              Close
            </button>
          </div>

          <p
            style={{
              fontSize: '12px',
              color: 'var(--dim)',
              textAlign: 'center',
              marginTop: '16px',
              fontStyle: 'italic',
            }}
          >
            This entry will be added to the spirit's eternal chronicle.
          </p>
        </form>
      </div>
    </div>
  )
}
