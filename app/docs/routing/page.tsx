const COLORS = {
  bg: "#0A1931",
  card: "#1B5E68",
  accent: "#FF6B6B",
  highlight: "#B9FF14",
  text: "#E5F2E9",
}

export default function RoutingDocs() {
  return (
    <main className="min-h-[60vh]" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold">Routing Guide</h1>
        <p className="mt-3 leading-relaxed">
          This guide explains how pages are structured and how navigation works in the app.
        </p>
        <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: COLORS.card }}>
          <ol className="list-decimal pl-6 text-sm leading-relaxed">
            <li>Use the App Router with folders as routes.</li>
            <li>Add nested folders for nested routes.</li>
            <li>Use layout.tsx for shared UI like Navbar and Footer.</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
