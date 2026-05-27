import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '120px 24px' }}>
      <div className="display" style={{ fontSize: '80px', color: 'var(--dim)', marginBottom: '16px' }}>404</div>
      <h1 className="display" style={{ fontSize: '32px', marginBottom: '16px' }}>SPIRIT NOT FOUND</h1>
      <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: '32px' }}>
        This Legend may have faded, or never existed.
      </p>
      <Link href="/" className="btn btn-ghost">← Return to home</Link>
    </main>
  )
}
