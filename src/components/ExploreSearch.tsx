'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PRIVILEGI, type Legend } from '@/lib/supabase'

interface ExploreSearchProps {
  legends: Legend[]
}

function calcAge(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  return `${Math.floor(days / 30)}mo`
}

export default function ExploreSearch({ legends }: ExploreSearchProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return legends

    const q = search.toLowerCase()
    return legends.filter(l =>
      l.nome?.toLowerCase().includes(q) ||
      l.id?.toLowerCase().includes(q) ||
      l.creatore?.toLowerCase().includes(q) ||
      l.possessore_attuale?.toLowerCase().includes(q) ||
      l.luogo_creazione?.toLowerCase().includes(q) ||
      l.tipo?.toLowerCase().includes(q)
    )
  }, [legends, search])

  return (
    <>
      {/* Search Bar */}
      <div style={{ marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="Search by name, ID, creator, keeper, location, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: '0',
          }}
        />
        {search && (
          <div style={{ fontSize: '12px', color: 'var(--dim)', marginTop: '8px' }}>
            Found {filtered.length} of {legends.length} spirits
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--dim)' }}>
          <p style={{ fontStyle: 'italic' }}>No spirits match your search.</p>
          <button
            onClick={() => setSearch('')}
            style={{
              marginTop: '16px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div>
          {filtered.map(l => {
            const p = PRIVILEGI[l.tipo as keyof typeof PRIVILEGI]
            return (
              <Link key={l.id} href={`/s/${l.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ marginBottom: '12px', cursor: 'pointer', transition: 'all 0.15s', borderLeft: `3px solid ${p.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span className="display" style={{ fontSize: '20px' }}>{l.nome}</span>
                        <span className="chip" style={{ background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}55` }}>{p.label}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                        #{l.id} · Aged {calcAge(l.creato)} · Keeper: <span style={{ color: 'var(--accent-light)' }}>{l.possessore_attuale}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--dim)', marginTop: '4px' }}>
                        Summoned by {l.creatore} in {l.luogo_creazione}
                      </div>
                    </div>
                    <div style={{ color: 'var(--dim)', fontSize: '18px', marginLeft: '16px' }}>→</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
