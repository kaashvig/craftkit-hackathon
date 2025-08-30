import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export function getSupabaseServer() {
  const url = process.env.SUPABASE_URL
  const anon = process.env.SUPABASE_ANON_KEY

  if (!url || !anon) {
    // Env not configured in this preview/session; callers must handle null
    return null as any
  }

  const cookieStore = cookies()

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        try {
          return cookieStore.get(name)?.value
        } catch {
          return undefined
        }
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // ignore in contexts where setting cookies is not allowed
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", expires: new Date(0), ...options })
        } catch {
          // ignore
        }
      },
    },
  })
}
