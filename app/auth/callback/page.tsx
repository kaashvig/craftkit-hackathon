"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseKey) {
        console.error("[v0] Missing NEXT_PUBLIC_SUPABASE_* env vars on callback")
        router.replace("/login")
        return
      }
      const supabase = createBrowserClient(supabaseUrl, supabaseKey)

      // This will read the code from the URL and set the session
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (error) {
        console.error("[v0] exchangeCodeForSession error:", error.message)
        router.replace("/login")
        return
      }

      try {
        await fetch("/api/auth/ensure-profile", { method: "POST" })
      } catch (_) {
        // non-fatal
      }

      // Optional: fetch user to confirm
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        router.replace("/") // redirect to home
      } else {
        router.replace("/login")
      }
    }
    run()
  }, [router])

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <p className="text-[#E5F2E9]">Finalizing sign-in…</p>
    </main>
  )
}
