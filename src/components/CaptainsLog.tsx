'use client'

import { useState } from 'react'
import { Awakening } from '@/lib/supabase'

interface CaptainsLogProps {
  awakenings: Awakening[]
  color: string
  onOpenLog: () => void
}

export default function CaptainsLog({ awakenings, color, onOpenLog }: CaptainsLogProps) {
  const logEntries = awakenings.filter((a) => a.tipo === 'passaggio').sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="display" style={{ fontSize: '24px' }}>
          📖 CHRONICLES
        </h2>
      </div>

      {/* Log Entries */}
      {logEntries.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            padding: '32px',
            textAlign: 'center',
            borderLeft: `3px solid ${color}`,
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>📖</div>
          <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
            No chronicles yet. Scan the QR code to record the first awakening...
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {logEntries.map((entry, index) => (
            <div
              key={entry.id}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid var(--border)`,
                borderLeft: `3px solid ${color}`,
                padding: '20px',
                animation: `slideUp 0.4s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Date Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: 'var(--dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                <span>📅</span>
                <span>{formatDate(entry.created_at)}</span>
              </div>

              {/* Keeper vs Worthiest Loss */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                  fontSize: '14px',
                  color: 'var(--accent-light)',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>{entry.da}</span>
                <span style={{ color: 'var(--muted)' }}>⚔️</span>
                <span>{entry.a}</span>
              </div>

              {/* Game & Location */}
              {entry.gioco && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                    🎲 <strong>{entry.gioco}</strong>
                  </span>
                  {entry.luogo && entry.luogo !== 'Unknown' && (
                    <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '12px' }}>
                      📍 {entry.luogo}
                    </span>
                  )}
                </div>
              )}

              {/* Full Entry Note */}
              {entry.note && (
                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--text)',
                    fontStyle: 'italic',
                    lineHeight: 1.7,
                    padding: '12px 0',
                    borderTop: `1px solid var(--border)`,
                    marginTop: '12px',
                    paddingTop: '12px',
                  }}
                >
                  "{entry.note}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Legend Info */}
      <div
        style={{
          marginTop: '24px',
          padding: '12px',
          background: 'var(--bg-light)',
          border: '1px solid var(--border)',
          fontSize: '12px',
          color: 'var(--muted)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        <span style={{ color }}>📖</span> Total Chronicles: {logEntries.length}
      </div>
    </div>
  )
}
