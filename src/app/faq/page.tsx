export default function FAQPage() {
  return (
    <main>
      <div className="wrap">
        <h1 className="display" style={{ fontSize: '48px', marginBottom: '8px' }}>VOCABULARY</h1>
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: '36px' }}>
          Drawn from the real language of gamers — MTG, D&D, Spirit Island, Warhammer.
        </p>

        <div style={{ display: 'grid', gap: '2px' }}>
          {[
            { term: 'Legend',          def: 'The physical NFC card. Consumable, unique. The body of the Spirit.' },
            { term: 'Spirit',          def: 'The digital soul. Lives on the web, accumulates story, never dies.' },
            { term: 'Keeper',          def: 'The current holder. Has the Right — but only if the Legend is brought into play.' },
            { term: 'The Circle',      def: 'The group of players gathered around the table.' },
            { term: 'Worthiest Loss',  def: 'The player who lost with the most skill, fairness, or grace. Receives the Legend.' },
            { term: 'Awakening',       def: 'The ritual transfer of the Legend from one Keeper to the next.' },
            { term: 'Chronicle',       def: 'The act of registering an Awakening in the Spirit\'s record.' },
            { term: 'Fade',            def: 'When the physical card deteriorates. The card fades; the Spirit endures.' },
          ].map(v => (
            <div key={v.term} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="display" style={{ fontSize: '15px', color: 'var(--accent-light)' }}>{v.term}</div>
              <div style={{ color: 'var(--muted)', fontSize: '16px' }}>{v.def}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
