import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const origin = url.origin
  const next = url.searchParams.get("next") || "/builder"

  // Create a Supabase server client using server-side env vars
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      // No-op on start; cookies will be set on callback exchange
      get: () => undefined,
      set: () => {},
      remove: () => {},
    },
  })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        // Ask user to pick account if already signed in to Google
        prompt: "select_account",
      },
    },
  })

  if (error || !data?.url) {
    // If something fails, return to login page with an error param
    const fallback = new URL("/login?error=oauth_start_failed", origin)
    return NextResponse.redirect(fallback)
  }

  return NextResponse.redirect(data.url, { status: 302 })
}
