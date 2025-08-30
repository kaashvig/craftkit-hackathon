"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function LoginForm({
  redirectTo = "/builder",
  className,
}: {
  redirectTo?: string
  className?: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const supabase = React.useMemo(() => getSupabaseBrowser(), [])
  const authConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      toast({
        title: "Auth not configured",
        description: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then refresh.",
      })
      return
    }
    if (!email || !password) {
      toast({ title: "Missing info", description: "Email and password are required." })
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast({ title: "Sign in failed", description: error.message })
        setLoading(false)
        return
      }

      try {
        await fetch("/api/auth/ensure-profile", { method: "POST" })
      } catch (_) {
        // non-fatal
      }

      toast({ title: "Signed in", description: "Welcome back!" })
      router.push("/") // redirect to home
      router.refresh()
    } catch (err: any) {
      toast({ title: "Unexpected error", description: String(err?.message || err) })
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "w-full max-w-sm space-y-4 rounded-lg border p-6",
        "bg-[#0A1931]/60 text-[#E5F2E9] border-[#1B5E68]/40 backdrop-blur",
        className,
      )}
      aria-label="Login form"
    >
      {!authConfigured && (
        <div className="rounded-md border border-[#1B5E68]/40 bg-[#0A1931] p-2 text-xs text-[#E5F2E9]/80">
          Email/password sign-in is disabled until auth variables are set.
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor="email" className="text-[#E5F2E9]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "bg-transparent text-[#E5F2E9] placeholder:text-[#E5F2E9]/50",
            "border-[#1B5E68] focus-visible:ring-2 focus-visible:ring-offset-0",
            "focus-visible:ring-[#B9FF14]",
          )}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-[#E5F2E9]">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={cn(
            "bg-transparent text-[#E5F2E9] placeholder:text-[#E5F2E9]/50",
            "border-[#1B5E68] focus-visible:ring-2 focus-visible:ring-offset-0",
            "focus-visible:ring-[#B9FF14]",
          )}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !supabase}
        className={cn("w-full font-medium", "bg-[#FF6B6B] hover:bg-[#e85d5d] text-[#0A1931]")}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-xs leading-5 text-[#E5F2E9]/70">By signing in you agree to our Terms and Privacy Policy.</p>
    </form>
  )
}
