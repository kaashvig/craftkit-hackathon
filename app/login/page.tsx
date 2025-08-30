import { getSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import GoogleOAuthButton from "@/components/auth/google-oauth-button"
import Link from "next/link"

export default async function LoginPage() {
  const supabase = getSupabaseServer()
  let user: { id: string } | null = null

  if (supabase) {
    const { data } = await supabase.auth.getUser()
    user = data.user
  }

  if (user) {
    redirect("/") // redirect authenticated users to home
  }

  const authConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center px-6">
      <div className="w-full rounded-xl border border-[#1B5E68]/50 bg-[#0A1931]/70 p-6 backdrop-blur md:p-8">
        {!authConfigured && (
          <div className="mb-4 rounded-lg border border-[#FF6B6B]/40 bg-[#0A1931] p-3 text-xs text-[#E5F2E9]/80">
            Authentication isn’t fully configured in this preview. Add NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY in Project Settings → Environment Variables, then refresh.
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left: brand storytelling */}
          <section className="flex flex-col justify-center">
            <h1 className="text-pretty text-3xl font-semibold text-[#E5F2E9] md:text-4xl">
              Welcome back to <span className="text-[#FF6B6B]">Craft‑Kit AI</span>
            </h1>
            <p className="mt-3 text-sm text-[#E5F2E9]/80">
              Pick up where you left off and keep building beautiful, functional apps faster.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-[#E5F2E9]">
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-[#B9FF14]" aria-hidden />
                <span>Secure authentication powered by JWT with Supabase.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-[#B9FF14]" aria-hidden />
                <span>Consistent design system with vibrant, accessible colors.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-[#B9FF14]" aria-hidden />
                <span>Instant access to your Builder and Database tools.</span>
              </li>
            </ul>
          </section>

          {/* Right: auth actions */}
          <section className="flex flex-col items-center justify-center">
            <div className="w-full max-w-sm">
              <GoogleOAuthButton />

              {/* separator */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px w-full bg-[#1B5E68]/40" aria-hidden />
                <span className="text-xs text-[#E5F2E9]/60">or</span>
                <div className="h-px w-full bg-[#1B5E68]/40" aria-hidden />
              </div>

              <LoginForm redirectTo="/" />
              <p className="mt-4 text-center text-xs text-[#E5F2E9]/70">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline text-[#FF6B6B] hover:text-[#e85d5d]">
                  Create one
                </Link>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
