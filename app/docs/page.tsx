const COLORS = {
  bg: "#0A1931",
  card: "#1B5E68",
  accent: "#FF6B6B",
  highlight: "#B9FF14",
  text: "#E5F2E9",
}

export default function DocsHome() {
  return (
    <main className="min-h-[60vh]" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold">Documentation</h1>
        <p className="mt-2 text-sm opacity-80">Welcome to the docs. Pick a guide to get started.</p>
        <div className="mt-6 grid gap-4">
          <a href="/docs/routing" className="rounded-md px-4 py-3" style={{ backgroundColor: COLORS.card }}>
            Routing Guide
          </a>
          <a href="/docs/api" className="rounded-md px-4 py-3" style={{ backgroundColor: COLORS.card }}>
            API Reference
          </a>
        </div>
      </section>
    </main>
  )
}
