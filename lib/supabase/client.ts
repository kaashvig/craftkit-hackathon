"use client"

import { createBrowserClient } from "@supabase/ssr"

let supabaseBrowser: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowser() {
  if (supabaseBrowser) return supabaseBrowser

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    // Avoid throwing during render; callers should handle null by disabling auth actions
    return null as any
  }

  supabaseBrowser = createBrowserClient(url, anon)
  return supabaseBrowser
}
