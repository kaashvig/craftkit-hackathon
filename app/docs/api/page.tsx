const COLORS = {
  bg: "#0A1931",
  card: "#1B5E68",
  accent: "#FF6B6B",
  highlight: "#B9FF14",
  text: "#E5F2E9",
}

export default function ApiDocs() {
  return (
    <main className="min-h-[60vh]" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold">API Reference</h1>
        <p className="mt-3 leading-relaxed">
          High‑level overview of endpoints and usage. Replace with real content as features land.
        </p>
        <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: COLORS.card }}>
          <ul className="text-sm leading-relaxed list-disc pl-6">
            <li>Authentication endpoints</li>
            <li>Project management endpoints</li>
            <li>Billing endpoints</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
