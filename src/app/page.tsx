import Link from 'next/link'

export default function Home() {

  return (
    <main>
      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <div style={{ fontSize: '13px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.2em', color: 'var(--dim)', marginBottom: '20px' }}>
          SPIRITS THAT LIVE THROUGH CIRCLES OF PLAY
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(64px, 12vw, 120px)', lineHeight: 1, background: 'linear-gradient(135deg, #C4A8FF, #D4A843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '24px' }}>
          LEGENDS
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--muted)', fontStyle: 'italic', maxWidth: '560px', margin: '0 auto 40px' }}>
          Every game has a spirit. Every loss, a story worth telling.
          Legends keeps both alive.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/explore" className="btn btn-primary">Explore Spirits</Link>
        </div>
      </section>

      <hr className="divider" />

      {/* WHAT IS A LEGEND */}
      <section className="wrap">
        <h2 className="display" style={{ fontSize: '40px', marginBottom: '24px' }}>WHAT IS A LEGEND?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start', marginBottom: '32px' }}>
          <div>
            <p style={{ color: 'var(--muted)', marginBottom: '16px', fontSize: '19px' }}>
              A Legend is a small physical card — NFC-enabled, unique, consumable. It carries a single privilege: the right to decide something for your group during the next game session.
            </p>
            <p style={{ color: 'var(--muted)', marginBottom: '16px', fontSize: '19px' }}>
              But a Legend is more than a card. Inside it lives a <strong style={{ color: 'var(--accent-light)' }}>Spirit</strong> — a digital entity that accumulates the history of every game played, every hand that held it, every city it travelled through.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '19px' }}>
              The card will fade with time. The Spirit never does.
            </p>
          </div>
          <div style={{ borderRadius: '4px', overflow: 'hidden' }}>
            <img
              src="/images/legend_game.png"
              alt="Legends gameplay - friends playing board games with a Legend card"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* WHAT IS A RIGHT */}
      <section className="wrap">
        <h2 className="display" style={{ fontSize: '40px', marginBottom: '8px' }}>WHAT IS A RIGHT?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '18px' }}>
          Many games lack explicit rules for deciding who goes first, who chooses a colour or faction, what gets played next, or who partners with whom. These decisions often fall to chance, habit, or (let's be honest) whoever shouts loudest. This leaves room for bullying, exclusion, or simply unfair outcomes.
        </p>
        <p style={{ color: 'var(--muted)', marginBottom: '32px', fontSize: '18px' }}>
          <strong style={{ color: 'var(--accent-light)' }}>A Right is an answer.</strong> When you bring your Legend into play, you invoke a privilege — a legitimate, agreed-upon authority to make one key decision. Fair. Respectful. Earned.
        </p>

        <div style={{ display: 'grid', gap: '24px' }}>
          {[
            { icon: '♔', title: 'FIRST', desc: 'You decide who opens the game.', color: '#D4A843' },
            { icon: '◈', title: 'COLOUR', desc: 'You choose your colour or faction.', color: '#9B7FD4' },
            { icon: '⚄', title: 'GAME', desc: 'You choose what game gets played.', color: '#6BB89B' },
            { icon: '❧', title: 'BOND', desc: 'You choose your partner or team.', color: '#D48B9B' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '20px', paddingBottom: '20px', borderBottom: idx < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: '40px', color: item.color, minWidth: '60px' }}>
                {item.icon}
              </div>
              <div>
                <div className="display" style={{ fontSize: '18px', marginBottom: '6px', color: item.color }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '16px', color: 'var(--muted)' }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* HOW IT WORKS */}
      <section className="wrap">
        <h2 className="display" style={{ fontSize: '40px', marginBottom: '32px' }}>HOW IT WORKS</h2>
        <div style={{ display: 'grid', gap: '0' }}>
          {[
            { step: '01', title: 'SUMMONING', desc: 'A Summoner creates a new Legend — names it, chooses its privilege, invokes its Spirit into the web.' },
            { step: '02', title: 'PLAY', desc: 'The Keeper brings the Legend to the table. Only then, with the Legend in play, can they exercise their Right.' },
            { step: '03', title: 'THE WORTHIEST LOSS', desc: 'At the end of the game, the Keeper identifies who played best without winning. Strategy, grace, fairplay — not the scoreboard.' },
            { step: '04', title: 'AWAKENING', desc: 'The Legend passes to the new Keeper. A ritual, a recognition. The Spirit stirs.' },
            { step: '05', title: 'CHRONICLE', desc: 'The new Keeper scans the card, opens the Spirit, and records the Awakening. Game, players, port. The story grows.' },
            { step: '06', title: 'FADE', desc: 'Over time, the card deteriorates. The Spirit survives. A new Legend can be summoned — same Spirit, new body.' },
          ].map((s, i, arr) => (
            <div key={s.step} style={{ display: 'flex', gap: '24px', paddingBottom: '28px', borderLeft: i < arr.length - 1 ? '1px solid var(--border)' : 'none', marginLeft: '20px', paddingLeft: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-8px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)' }} />
              <div style={{ flex: 1 }}>
                <div className="display" style={{ fontSize: '11px', color: 'var(--dim)', letterSpacing: '0.2em', marginBottom: '4px' }}>STEP {s.step}</div>
                <div className="display" style={{ fontSize: '22px', color: 'var(--accent-light)', marginBottom: '8px' }}>{s.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: '17px' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />


      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 24px', background: 'linear-gradient(180deg, transparent, rgba(123, 94, 167, 0.08))' }}>
        <h2 className="display" style={{ fontSize: '48px', marginBottom: '16px' }}>READY TO AWAKEN A SPIRIT?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '32px', fontStyle: 'italic' }}>Scan the QR code on your Legend card to begin the summoning.</p>
      </section>
    </main>
  )
}
