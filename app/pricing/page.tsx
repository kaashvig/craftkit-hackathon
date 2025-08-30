const COLORS = {
  bg: "#0A1931",
  card: "#1B5E68",
  accent: "#FF6B6B",
  highlight: "#B9FF14",
  text: "#E5F2E9",
}

export default function PricingPage() {
  return (
    <main className="min-h-[60vh]" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-balance">Pricing</h1>
        <p className="mt-2 text-sm opacity-80">Choose the plan that fits your workflow. Simple, transparent pricing.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { name: "Starter", price: "Free", desc: "For exploration and demos." },
            { name: "Pro", price: "$19/mo", desc: "For builders shipping features." },
            { name: "Team", price: "$49/mo", desc: "For teams collaborating." },
          ].map((t) => (
            <div key={t.name} className="rounded-lg p-5" style={{ backgroundColor: COLORS.card }}>
              <h3 className="text-lg font-medium">{t.name}</h3>
              <p className="mt-1 text-2xl" style={{ color: COLORS.highlight }}>
                {t.price}
              </p>
              <p className="mt-2 text-sm opacity-80">{t.desc}</p>
              <button
                className="mt-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
                style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
