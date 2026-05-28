import { supabase } from '@/lib/supabase'
import ExploreSearch from '@/components/ExploreSearch'

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
            <p style={{ fontStyle: 'italic' }}>No legends yet. Scan a QR code to summon the first Spirit.</p>
          </div>
        ) : (
          <ExploreSearch legends={legends} />
        )}
      </div>
    </main>
  )
}
