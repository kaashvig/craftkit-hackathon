const COLORS = {
  bg: "#0A1931",
  card: "#1B5E68",
  accent: "#FF6B6B",
  highlight: "#B9FF14",
  text: "#E5F2E9",
}

export default function AboutPage() {
  return (
    <main className="min-h-[60vh]" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-balance">About Us</h1>
        <p className="mt-3 leading-relaxed">
          Craft‑Kit AI helps you go from idea to interface in minutes. We blend vibrant design with pragmatic developer
          workflows to ship experiences that feel great.
        </p>
        <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: COLORS.card }}>
          <h2 className="text-lg font-medium">Our Principles</h2>
          <ul className="mt-3 text-sm leading-relaxed list-disc pl-6">
            <li>Design clarity with just 3–5 colors.</li>
            <li>Accessible, responsive, and fast by default.</li>
            <li>Composable building blocks you actually enjoy using.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
