'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, PRIVILEGI } from '@/lib/supabase'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const genId = () => Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')

export default function SummonPage() {
  const router = useRouter()
  const [tipo, setTipo]   = useState<string>('primo')
  const [nome, setNome]   = useState('')
  const [nick, setNick]   = useState('')
  const [port, setPort]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || !nick.trim()) { setError('Name and nickname are required.'); return }
    setLoading(true)
    setError(null)

    const id = genId()

    const { error: legErr } = await supabase.from('legends').insert({
      id, tipo, nome: nome.trim(),
      creatore: nick.trim(),
      luogo_creazione: port.trim() || 'Unknown',
      possessore_attuale: nick.trim(),
    })

    if (legErr) { setError('Error summoning legend. Try again.'); setLoading(false); return }

    await supabase.from('awakenings').insert({
      legend_id: id, tipo: 'creazione',
      a: nick.trim(), luogo: port.trim() || 'Unknown',
    })

    router.push(`/s/${id}`)
  }

  return (
    <main>
      <div className="wrap" style={{ maxWidth: '600px' }}>
        <h1 className="display" style={{ fontSize: '48px', marginBottom: '8px' }}>SUMMON A LEGEND</h1>
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: '36px' }}>
          Invoke a new Spirit into existence. Choose its privilege. Name it. Set it free.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Tipo selector */}
          <div style={{ marginBottom: '32px' }}>
            <div className="display" style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.18em', marginBottom: '12px' }}>
              CHOOSE THE PRIVILEGE
            </div>
            <div className="tipo-grid">
              {Object.entries(PRIVILEGI).map(([key, p]) => (
                <div key={key} className={`tipo-card ${tipo === key ? 'selected' : ''}`} onClick={() => setTipo(key)} style={{ borderColor: tipo === key ? p.color : undefined }}>
                  <div className="chip" style={{ background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}55`, marginBottom: '10px' }}>{p.label}</div>
                  <div className="display" style={{ fontSize: '15px', marginBottom: '6px', color: tipo === key ? p.color : 'var(--text)' }}>{p.nome}</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label>LEGEND NAME *</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="e.g. The Wanderer, Iron Phantom…" maxLength={50} required />
          </div>

          <div className="field">
            <label>YOUR NICKNAME — THE SUMMONER *</label>
            <input value={nick} onChange={e => setNick(e.target.value)} placeholder="How the Spirit will know you" maxLength={40} required />
          </div>

          <div className="field">
            <label>PORT OF ORIGIN</label>
            <input value={port} onChange={e => setPort(e.target.value)} placeholder="City, Country" maxLength={60} />
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" style={{ fontSize: '18px', padding: '16px' }} disabled={loading}>
            {loading ? 'Summoning…' : '✦ Forge the Legend'}
          </button>
        </form>
      </div>
    </main>
  )
}
