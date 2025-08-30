import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

function getCookieFromHeader(req: NextRequest, name: string): string | undefined {
  const cookieHeader = req.headers.get("cookie")
  if (!cookieHeader) return undefined
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const next = url.searchParams.get("next") || "/builder"

  // Prepare a mutable response where we can set cookies
  const res = NextResponse.redirect(new URL(next, url.origin))

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => getCookieFromHeader(req, name),
      set: (name: string, value: string, options: any) => {
        res.cookies.set({ name, value, ...options })
      },
      remove: (name: string, options: any) => {
        try {
          res.cookies.delete(name)
        } catch {
          res.cookies.set({ name, value: "", expires: new Date(0), ...options })
        }
      },
    },
  })

  try {
    const code = url.searchParams.get("code")
    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
    }
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth_callback_failed", url.origin))
  }

  return res
}
