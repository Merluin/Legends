'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Props = { params: Promise<{ id: string }> }

export default function AwakenPage({ params }: Props) {
  const { id: rawId } = use(params)
  const id = rawId.toUpperCase()
  const router = useRouter()

  const [keeper, setKeeper]   = useState('')
  const [game, setGame]       = useState('')
  const [players, setPlayers] = useState('')
  const [port, setPort]       = useState('')
  const [note, setNote]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keeper.trim() || !game.trim()) { setError('New Keeper and Game are required.'); return }
    setLoading(true)
    setError(null)

    const { data: legend, error: legendErr } = await supabase
      .from('legends')
      .select('possessore_attuale')
      .eq('id', id)
      .single()

    if (legendErr || !legend) { setError('Legend not found.'); setLoading(false); return }

    const { error: insertErr } = await supabase.from('awakenings').insert({
      legend_id: id,
      tipo: 'passaggio',
      da: legend.possessore_attuale,
      a: keeper.trim(),
      gioco: game.trim(),
      num_giocatori: players ? parseInt(players) : null,
      luogo: port.trim() || 'Unknown',
      note: note.trim() || null,
    })

    if (insertErr) { setError('Error recording awakening. Try again.'); setLoading(false); return }

    await supabase.from('legends').update({ possessore_attuale: keeper.trim() }).eq('id', id)

    router.push(`/s/${id}`)
    router.refresh()
  }

  return (
    <main>
      <div className="wrap" style={{ maxWidth: '560px' }}>
        <Link href={`/s/${id}`} className="back-link">← Back to Spirit</Link>

        <h1 className="display" style={{ fontSize: '40px', marginBottom: '8px' }}>CHRONICLE AN AWAKENING</h1>
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: '32px' }}>
          Record the moment the Legend changes hands.
        </p>

        <div className="card" style={{ marginBottom: '28px' }}>
          <div className="display" style={{ fontSize: '10px', color: 'var(--dim)', letterSpacing: '0.2em', marginBottom: '6px' }}>LEGEND</div>
          <div className="display" style={{ fontSize: '22px', color: 'var(--accent-light)' }}>#{id}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>THE WORTHIEST LOSS — NEW KEEPER NICKNAME *</label>
            <input value={keeper} onChange={e => setKeeper(e.target.value)} placeholder="Who played best without winning?" maxLength={40} required />
          </div>
          <div className="field">
            <label>GAME PLAYED *</label>
            <input value={game} onChange={e => setGame(e.target.value)} placeholder="Wingspan, Catan, Dixit…" maxLength={60} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="field">
              <label>PLAYERS IN THE CIRCLE</label>
              <input type="number" min="2" max="20" value={players} onChange={e => setPlayers(e.target.value)} placeholder="4" />
            </div>
            <div className="field">
              <label>PORT (CITY)</label>
              <input value={port} onChange={e => setPort(e.target.value)} placeholder="Milano" maxLength={60} />
            </div>
          </div>
          <div className="field">
            <label>A NOTE FOR THE LOG (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What made this loss worthy?" maxLength={280} />
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Sealing…' : '✦ Seal the Awakening'}
          </button>
        </form>
      </div>
    </main>
  )
}
