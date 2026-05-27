import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase, PRIVILEGI } from '@/lib/supabase'
import type { Metadata } from 'next'

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase.from('legends').select('nome').eq('id', params.id.toUpperCase()).single()
  return { title: data ? `${data.nome} — Legends` : 'Spirit Not Found' }
}

function calcAge(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  const m = Math.floor(days / 30)
  return m === 1 ? '1 month' : `${m} months`
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function SpiritPage({ params }: Props) {
  const id = params.id.toUpperCase()

  const [{ data: legend }, { data: awakenings }] = await Promise.all([
    supabase.from('legends').select('*').eq('id', id).single(),
    supabase.from('awakenings').select('*').eq('legend_id', id).order('created_at', { ascending: true }),
  ])

  if (!legend) notFound()

  const tipo = PRIVILEGI[legend.tipo as keyof typeof PRIVILEGI]
  const passes = awakenings?.filter(a => a.tipo === 'passaggio') ?? []
  const keepers = [...new Set(awakenings?.map(a => a.a))]
  const luoghi = [...new Set(awakenings?.map(a => a.luogo).filter(Boolean))]
  const giochi = passes.reduce<Record<string, number>>((acc, p) => {
    if (p.gioco) acc[p.gioco] = (acc[p.gioco] || 0) + 1
    return acc
  }, {})

  return (
    <main>
      <div className="wrap">
        <Link href="/explore" className="back-link">← All Legends</Link>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div className="display" style={{ fontSize: '11px', color: 'var(--dim)', letterSpacing: '0.2em', marginBottom: '8px' }}>
              CAPTAIN'S LOG · #{legend.id}
            </div>
            <h1 className="display" style={{ fontSize: 'clamp(40px, 8vw, 64px)', lineHeight: 1, marginBottom: '12px' }}>
              {legend.nome}
            </h1>
            <span className="chip" style={{ background: `${tipo.color}22`, color: tipo.color, border: `1px solid ${tipo.color}55` }}>
              {tipo.nome.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: '48px', opacity: 0.7 }}>
            {legend.tipo === 'primo' ? '♔' : legend.tipo === 'colore' ? '◈' : legend.tipo === 'gioco' ? '⚄' : '❧'}
          </div>
        </div>

        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: '32px', fontSize: '17px' }}>
          {tipo.desc}
        </p>

        <hr className="divider" />

        {/* Eye of the Spirit */}
        <div className="eye-section">
          <div className="eye-header">
            <span style={{ fontSize: '20px' }}>👁</span>
            <span className="display" style={{ fontSize: '18px', color: 'var(--accent-light)', letterSpacing: '0.12em' }}>
              EYE OF THE SPIRIT
            </span>
          </div>

          <div className="stat-grid">
            <div className="stat-box">
              <div className="val">{calcAge(legend.creato)}</div>
              <div className="lbl">AGED</div>
            </div>
            <div className="stat-box">
              <div className="val">{keepers.length}</div>
              <div className="lbl">KEEPERS</div>
            </div>
            <div className="stat-box">
              <div className="val">{passes.length}</div>
              <div className="lbl">AWAKENINGS</div>
            </div>
            <div className="stat-box">
              <div className="val">{luoghi.length}</div>
              <div className="lbl">PORTS</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div className="display" style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '12px' }}>GAMES PLAYED</div>
              {Object.keys(giochi).length === 0 ? (
                <div style={{ color: 'var(--dim)', fontStyle: 'italic', fontSize: '15px' }}>None yet</div>
              ) : Object.entries(giochi).sort((a, b) => b[1] - a[1]).map(([game, count]) => (
                <div key={game} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '16px' }}>
                  <span>{game}</span>
                  <span className="display" style={{ color: 'var(--gold)' }}>{count}×</span>
                </div>
              ))}
            </div>
            <div>
              <div className="display" style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '12px' }}>PORTS VISITED</div>
              {luoghi.length === 0 ? (
                <div style={{ color: 'var(--dim)', fontStyle: 'italic', fontSize: '15px' }}>None yet</div>
              ) : luoghi.map(l => (
                <div key={l} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '15px', color: 'var(--muted)' }}>
                  📍 {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Keeper */}
        <div className="card-glow" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="display" style={{ fontSize: '11px', color: 'var(--dim)', letterSpacing: '0.2em', marginBottom: '8px' }}>CURRENT KEEPER</div>
          <div className="display" style={{ fontSize: '32px', color: tipo.color }}>{legend.possessore_attuale}</div>
          <div style={{ fontSize: '14px', color: 'var(--dim)', fontStyle: 'italic', marginTop: '6px' }}>
            {legend.autenticato ? '✓ Authenticated Legend' : 'Phase 0 — Paper prototype'}
          </div>
        </div>

        <Link href={`/s/${legend.id}/awaken`} className="btn btn-primary btn-block" style={{ marginBottom: '32px', display: 'block', textAlign: 'center' }}>
          ✦ Chronicle an Awakening
        </Link>

        <hr className="divider" />

        {/* Ship's Log */}
        <h2 className="display" style={{ fontSize: '28px', marginBottom: '24px' }}>SHIP'S LOG</h2>
        <div>
          {[...(awakenings ?? [])].reverse().map((entry, idx, arr) => (
            <div key={entry.id} className="timeline-item">
              <div className="timeline-dot">
                <div className="dot" style={{ background: entry.tipo === 'creazione' ? 'var(--gold)' : 'var(--accent)' }} />
                {idx < arr.length - 1 && <div className="line" />}
              </div>
              <div className="timeline-content">
                <div className="timeline-date">📅 {fmtDate(entry.created_at)}</div>
                {entry.tipo === 'creazione' ? (
                  <>
                    <div className="display" style={{ fontSize: '16px', color: 'var(--gold)', marginBottom: '4px' }}>
                      SUMMONED BY {entry.a.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--muted)' }}>📍 {entry.luogo}</div>
                  </>
                ) : (
                  <>
                    <div className="display" style={{ fontSize: '16px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--muted)' }}>{entry.da}</span>
                      <span style={{ color: 'var(--accent)', margin: '0 8px' }}>→</span>
                      <span style={{ color: 'var(--accent-light)' }}>{entry.a}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontStyle: 'italic', marginBottom: '4px' }}>
                      {entry.gioco}{entry.num_giocatori && <span style={{ color: 'var(--dim)' }}> · {entry.num_giocatori} players</span>}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--muted)' }}>📍 {entry.luogo}</div>
                    {entry.note && (
                      <div style={{ marginTop: '8px', padding: '10px', background: 'var(--bg-light)', borderLeft: '2px solid var(--border-light)', fontSize: '15px', fontStyle: 'italic', color: 'var(--muted)' }}>
                        "{entry.note}"
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
