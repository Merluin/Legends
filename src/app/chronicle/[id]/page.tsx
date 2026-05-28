import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase, PRIVILEGI, type Legend } from '@/lib/supabase'
import type { Metadata } from 'next'
import KeeperUpdater from '@/components/KeeperUpdater'

interface ChroniclePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ChroniclePageProps): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase
    .from('legends')
    .select('nome')
    .eq('id', id.toUpperCase())
    .single()

  return {
    title: data ? `${data.nome} — Chronicle` : 'Chronicle Not Found',
  }
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function calculateDaysAgo(timestamp: number): string {
  const days = Math.floor((Date.now() - timestamp) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? '1 month ago' : `${months} months ago`
}

export default async function ChroniclePage({ params }: ChroniclePageProps) {
  const { id } = await params
  const upperId = id.toUpperCase()

  const { data: legend } = await supabase
    .from('legends')
    .select('*')
    .eq('id', upperId)
    .single()

  if (!legend) {
    notFound()
  }

  const privilegi = PRIVILEGI[legend.tipo as keyof typeof PRIVILEGI]

  return (
    <main>
      <div className="wrap">
        <Link href="/explore" className="back-link">← All Legends</Link>

        {/* Chronicle Header */}
        <div className="chronicle-header">
          <div className="chronicle-sigil" style={{ '--sigil-color': privilegi.color } as React.CSSProperties}>
            {legend.tipo === 'primo' ? '♔' : legend.tipo === 'colore' ? '◈' : legend.tipo === 'gioco' ? '⚄' : '❧'}
          </div>

          <div className="chronicle-title-group">
            <div className="chronicle-label">CHRONICLE OF</div>
            <h1 className="display chronicle-title">
              {legend.nome}
            </h1>
            <div
              className="chronicle-tipo-chip"
              style={{
                background: `${privilegi.color}22`,
                color: privilegi.color,
                border: `1px solid ${privilegi.color}55`,
              }}
            >
              {privilegi.nome.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="chronicle-description">
          {privilegi.desc}
        </p>

        <hr className="divider" />

        {/* Activation Details */}
        <div className="chronicle-discovery">
          <div className="discovery-grid">
            <div className="discovery-item">
              <div className="discovery-label">DISCOVERED</div>
              <div className="discovery-value">today</div>
              <div className="discovery-date">Just awakened</div>
            </div>

            <div className="discovery-item">
              <div className="discovery-label">CURRENT KEEPER</div>
              <div className="discovery-value" style={{ color: privilegi.color }}>
                {legend.possessore_attuale}
              </div>
              <div className="discovery-date">The bearer of this token</div>
            </div>

            <div className="discovery-item">
              <div className="discovery-label">FACTION</div>
              <div className="discovery-value">{privilegi.label}</div>
              <div className="discovery-date">Type of privilege</div>
            </div>

            <div className="discovery-item">
              <div className="discovery-label">ORIGIN</div>
              <div className="discovery-value">{legend.creatore}</div>
              <div className="discovery-date">Summoned by</div>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Call to Action */}
        <div className="chronicle-cta">
          <div className="cta-content">
            <div className="cta-icon">✦</div>
            <h2 className="display" style={{ fontSize: '24px', marginBottom: '8px' }}>
              A Totem Awakens
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
              This QR code represents a permanent legend. Track its journey across games and gatherings.
            </p>

            <div className="cta-info" style={{ background: 'var(--bg-light)', padding: '16px', borderLeft: '3px solid var(--gold)', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: 'var(--dim)', marginBottom: '4px' }}>QR ID</div>
              <div className="display" style={{ fontSize: '16px', color: 'var(--gold)' }}>
                {legend.id}
              </div>
            </div>

            <Link href="/explore" className="btn btn-primary btn-block">
              ← Explore More Legends
            </Link>

            <KeeperUpdater
              legendId={legend.id}
              currentKeeper={legend.possessore_attuale}
              color={privilegi.color}
            />
          </div>
        </div>

        {/* Origins Info */}
        <hr className="divider" />

        <div className="chronicle-origins">
          <h2 className="display" style={{ fontSize: '20px', marginBottom: '16px' }}>ORIGINS</h2>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px', borderRadius: '0' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                Summoned by
              </div>
              <div style={{ fontSize: '18px', color: 'var(--accent-light)' }}>
                {legend.creatore}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                In
              </div>
              <div style={{ fontSize: '18px', color: 'var(--text)' }}>
                📍 {legend.luogo_creazione}
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--dim)', marginBottom: '8px' }}>
            {legend.autenticato ? '✓ VERIFIED LEGEND' : 'PROTOTYPE STATUS'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
            This totem will continue to gather awakening records as it moves through the world.
          </div>
        </div>
      </div>
    </main>
  )
}
