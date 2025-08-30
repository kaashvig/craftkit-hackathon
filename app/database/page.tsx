import { getSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const COLORS = {
  bg: "#0A1931",
  card: "#1B5E68",
  accent: "#FF6B6B",
  highlight: "#B9FF14",
  text: "#E5F2E9",
}

export default async function DatabasePage() {
  const supabase = getSupabaseServer()

  if (!supabase) {
    return (
      <main className="min-h-[60vh]" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
        <section className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-semibold">Database</h1>
          <p className="mt-3 text-sm opacity-80">
            Supabase environment variables are not available in this preview. Add SUPABASE_URL and SUPABASE_ANON_KEY in
            Project Settings → Environment Variables, then refresh the preview.
          </p>
          <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: COLORS.card }}>
            <h2 className="text-lg font-medium">What’s next?</h2>
            <ul className="mt-3 text-sm leading-relaxed list-disc pl-6">
              <li>Configure Supabase env vars (server): SUPABASE_URL, SUPABASE_ANON_KEY.</li>
              <li>
                Optionally add client vars for browser auth: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
              </li>
              <li>Run SQL scripts to create tables and RLS, then revisit this page.</li>
            </ul>
          </div>
        </section>
      </main>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/database")
  }

  return (
    <main className="min-h-[60vh]" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold">Database</h1>
        <p className="mt-2 text-sm opacity-80">
          This is a placeholder. We can wire Supabase or Neon next for real data and auth‑guarded dashboards.
        </p>
        <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: COLORS.card }}>
          <h2 className="text-lg font-medium">What’s next?</h2>
          <ul className="mt-3 text-sm leading-relaxed list-disc pl-6">
            <li>Connect an integration (Supabase / Neon) with secure env vars.</li>
            <li>Run schema scripts and seed sample data.</li>
            <li>Build read/write UI with optimistic updates.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
