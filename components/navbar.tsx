"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import useSWR from "swr"
import { getSupabaseBrowser } from "@/lib/supabase/client"

const COLORS = {
  navy: "#0A1931",
  teal: "#1B5E68",
  coral: "#FF6B6B",
  lime: "#B9FF14",
  offwhite: "#E5F2E9",
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 text-sm font-medium transition-colors rounded-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      ].join(" ")}
      style={
        {
          ["--tw-ring-color" as any]: COLORS.lime,
          color: isActive ? COLORS.offwhite : "rgba(229,242,233,0.8)",
          backgroundColor: isActive ? "rgba(27,94,104,0.40)" : "transparent",
        } as React.CSSProperties
      }
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const { toast } = useToast()
  const router = useRouter()

  const hasSupabaseEnv =
    typeof process !== "undefined" &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const { data: userData } = useSWR(
    hasSupabaseEnv ? "supabase-user" : null,
    async () => {
      try {
        const supabase = getSupabaseBrowser()
        const { data } = await supabase.auth.getUser()
        return data.user
      } catch {
        return null
      }
    },
    { revalidateOnFocus: true },
  )

  const handleSignOut = async () => {
    if (!hasSupabaseEnv) {
      toast({
        title: "Auth not configured",
        description:
          "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Project Settings, then refresh.",
      })
      return
    }
    try {
      const supabase = getSupabaseBrowser()
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({ title: "Sign out failed", description: error.message })
        return
      }
      toast({ title: "Signed out", description: "See you soon." })
      router.refresh()
    } catch (e: any) {
      toast({ title: "Auth not available", description: String(e?.message || e) })
    }
  }

  return (
    <header
      className="w-full border-b"
      style={{
        backgroundColor: COLORS.navy,
        borderColor: COLORS.teal,
      }}
    >
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-semibold tracking-tight" style={{ color: COLORS.offwhite }}>
            Craft‑Kit AI
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" label="Home" />
            <NavLink href="/pricing" label="Pricing" />
            <NavLink href="/about" label="About Us" />
            <NavLink href="/database" label="Database" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!userData ? (
            <Link href="/login" aria-label="Go to login">
              <Button
                variant="outline"
                className="text-sm bg-transparent"
                style={{
                  color: COLORS.offwhite,
                  borderColor: COLORS.teal,
                  backgroundColor: "transparent",
                }}
              >
                Sign in
              </Button>
            </Link>
          ) : (
            <>
              <span className="hidden md:inline text-xs" style={{ color: "rgba(229,242,233,0.8)" }}>
                {userData.email}
              </span>
              <Button
                onClick={handleSignOut}
                className="text-sm"
                style={{
                  color: COLORS.navy,
                  backgroundColor: COLORS.coral,
                }}
                aria-label="Sign out"
              >
                Sign out
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
