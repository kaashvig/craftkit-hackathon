const COLORS = { bg: "#0A1931", card: "#1B5E68", accent: "#FF6B6B", highlight: "#B9FF14", text: "#E5F2E9" }

export default function PrivacyPage() {
  return (
    <main className="min-h-[60vh]" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-3 leading-relaxed text-sm opacity-90">
          Placeholder privacy content. Replace with your real policy text.
        </p>
      </section>
    </main>
  )
}
