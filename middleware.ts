import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are not available in this runtime, skip Supabase middleware gracefully.
  if (!url || !anon) {
    return NextResponse.next()
  }

  const res = NextResponse.next({ request: { headers: req.headers } })

  try {
    const supabase = createServerClient(url, anon, {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            res.cookies.set({ name, value, ...options })
          } catch {
            // ignore cookie set failures
          }
        },
        remove(name: string, options: any) {
          try {
            res.cookies.set({ name, value: "", ...options })
          } catch {
            // ignore cookie removal failures
          }
        },
      },
    })

    // Touch session to refresh if needed; ignore the result
    await supabase.auth.getSession().catch(() => {})
  } catch {
    // On any middleware failure, proceed without blocking the request.
    return res
  }

  return res
}

// Limit this middleware to only routes that need auth freshness.
export const config = {
  matcher: ["/builder", "/database"],
}
