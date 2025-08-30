"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      const supabase = getSupabaseBrowser()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/builder`,
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setMessage("Check your email to confirm your account, then sign in.")
        router.push("/login")
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[75svh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md mx-auto border-teal-700/40 bg-background/70 backdrop-blur">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>We’ll send a confirmation link to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {message ? <p className="text-sm text-foreground">{message}</p> : null}
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
