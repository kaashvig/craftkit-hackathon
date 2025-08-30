"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowser } from "@/lib/supabase/client"

export default function GoogleOAuthButton({ next = "/builder" }: { next?: string }) {
  const [loading, setLoading] = useState(false)
  const authConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  async function handleGoogle() {
    try {
      setLoading(true)
      const supabase = getSupabaseBrowser()
      if (!supabase) {
        setLoading(false)
        return
      }
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { prompt: "select_account" },
        },
      })
      if (data?.url) window.location.href = data.url
      if (error) {
        console.error("[v0] Google OAuth start error:", error.message)
        setLoading(false)
      }
    } catch (err: any) {
      console.error("[v0] Google OAuth unexpected error:", err?.message || err)
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Button
        onClick={handleGoogle}
        disabled={loading || !authConfigured}
        className="w-full md:w-auto bg-[#E5F2E9] text-[#0A1931] hover:bg-[#E5F2E9]/90 border border-[#1B5E68]/50"
        aria-label="Continue with Google"
      >
        {loading ? "Redirecting…" : "Continue with Google"}
      </Button>
    </div>
  )
}
