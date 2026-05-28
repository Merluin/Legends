'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface KeeperUpdaterProps {
  legendId: string
  currentKeeper: string
  color: string
}

export default function KeeperUpdater({ legendId, currentKeeper, color }: KeeperUpdaterProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newKeeper, setNewKeeper] = useState(currentKeeper)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async () => {
    if (!newKeeper.trim()) {
      setError('Keeper name cannot be empty')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('legends')
        .update({ possessore_attuale: newKeeper })
        .eq('id', legendId.toUpperCase())

      if (updateError) throw updateError

      setIsEditing(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update keeper')
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-ghost"
          style={{ display: 'inline-block' }}
        >
          ✓ Update Current Keeper
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `2px solid ${color}`,
      padding: '24px',
      marginTop: '24px',
    }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontFamily: 'Bebas Neue',
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: 'var(--dim)',
          marginBottom: '8px',
        }}>
          NEW KEEPER NAME
        </label>
        <input
          type="text"
          value={newKeeper}
          onChange={(e) => setNewKeeper(e.target.value)}
          placeholder="Who possesses this totem now?"
          autoFocus
        />
      </div>

      {error && (
        <div className="error-box" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="btn btn-primary"
          style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Updating...' : 'Save'}
        </button>
        <button
          onClick={() => {
            setIsEditing(false)
            setNewKeeper(currentKeeper)
            setError(null)
          }}
          className="btn btn-ghost"
          style={{ flex: 1 }}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
