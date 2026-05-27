import Link from 'next/link'
import { supabase, PRIVILEGI } from '@/lib/supabase'

function calcAge(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  return `${Math.floor(days / 30)}mo`
}

export const revalidate = 60

export default async function ExplorePage() {
  const { data: legends } = await supabase
    .from('legends')
    .select('*')
    .order('creato', { ascending: false })

  return (
    <main>
      <div className="wrap">
        <h1 className="display" style={{ fontSize: '48px', marginBottom: '8px' }}>ALL LEGENDS</h1>
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: '36px' }}>
          {legends?.length ?? 0} spirits in circulation
        </p>

        {!legends || legends.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--dim)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>◈</div>
            <p style={{ fontStyle: 'italic' }}>No legends yet. Be the first Summoner.</p>
            <Link href="/summon" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>Summon a Legend</Link>
          </div>
        ) : (
          <div>
            {legends.map(l => {
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

        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <Link href="/summon" className="btn btn-primary">+ Summon a New Legend</Link>
        </div>
      </div>
    </main>
  )
}
