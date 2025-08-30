"use client"

import React from "react"
import GlowButton from "./glow-button"
import ProximityIcons from "./proximity-icons"
import { cn } from "@/lib/utils"

export default function HeroSection() {
  return (
    <header className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-16 text-center md:py-24">
      <Badge>Craft‑Kit AI</Badge>
      <h1 className="text-balance font-sans text-4xl font-semibold leading-tight text-[var(--text)] md:text-6xl">
        Build a production‑ready full‑stack app
        <br />
        from an idea — in minutes
      </h1>
      <p className="text-pretty max-w-2xl text-base leading-relaxed text-[color:rgba(229,242,233,0.85)] md:text-lg">
        Visually design your app. Generate clean React + Tailwind code, a secure backend, and deploy with one click.
        Vibrant, powerful, and truly yours.
      </p>

      <ProximityIcons />

      <FormCard className="w-full max-w-2xl">
        <AppNameForm />
      </FormCard>

      <SmallFeatures />

      <FooterNote />
    </header>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm"
      style={{
        background: "rgba(27,94,104,0.25)",
        border: "1px solid rgba(185,255,20,0.35)",
        color: "var(--text)",
        boxShadow: "0 0 0 1px rgba(185,255,20,0.12) inset, 0 0 18px rgba(185,255,20,0.25)",
      }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{
          background: "var(--highlight)",
          boxShadow: "0 0 10px rgba(185,255,20,0.8)",
        }}
        aria-hidden="true"
      />
      <span className="font-medium"> {children} </span>
    </div>
  )
}

function FormCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-xl p-4 md:p-6", className)}
      style={{
        background: "linear-gradient(180deg, rgba(27,94,104,0.4), rgba(27,94,104,0.18))",
        border: "1px solid rgba(229,242,233,0.15)",
        boxShadow: "0 10px 30px rgba(10,25,49,0.55), inset 0 0 0 1px rgba(229,242,233,0.04)",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* faint corner glows */}
      <span
        className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full opacity-50"
        style={{
          background: "radial-gradient(closest-side, rgba(185,255,20,0.35), transparent)",
          filter: "blur(10px)",
        }}
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-8 -right-6 h-28 w-28 rounded-full opacity-50"
        style={{
          background: "radial-gradient(closest-side, rgba(255,107,107,0.35), transparent)",
          filter: "blur(10px)",
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

function AppNameForm() {
  const [name, setName] = React.useState("")
  const [started, setStarted] = React.useState<null | "ok" | "error">(null)
  const [loading, setLoading] = React.useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setStarted("error")
      return
    }
    setLoading(true)
    // Simulate startup + persist name locally for future steps
    setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("craftkit:appName", name.trim())
        }
        setStarted("ok")
      } catch {
        setStarted("ok")
      } finally {
        setLoading(false)
      }
    }, 700)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-stretch gap-4">
      <label htmlFor="app-name" className="sr-only">
        App Name
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="app-name"
          name="app-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your app name..."
          className={cn(
            "w-full rounded-lg border bg-transparent px-4 py-3 font-sans text-base text-[var(--text)] outline-none transition",
            "focus:ring-2 focus:ring-offset-0 focus:ring-[var(--highlight)]",
          )}
          style={{
            borderColor: started === "error" ? "rgba(255,107,107,0.65)" : "rgba(229,242,233,0.18)",
            boxShadow:
              started === "error" ? "0 0 0 3px rgba(255,107,107,0.18)" : "inset 0 0 0 1px rgba(229,242,233,0.04)",
          }}
          aria-invalid={started === "error"}
        />
        <GlowButton
          type="submit"
          disabled={loading}
          className={cn("min-w-40", loading && "opacity-90 cursor-not-allowed")}
        >
          {loading ? "Starting..." : "Start Building"}
        </GlowButton>
      </div>

      {/* Status message */}
      {started === "ok" && (
        <div
          className="rounded-md px-3 py-2 text-sm"
          style={{
            background: "rgba(185,255,20,0.1)",
            border: "1px solid rgba(185,255,20,0.35)",
            color: "var(--text)",
          }}
          role="status"
        >
          Crafting “{name}” — settings saved locally. You’re ready for the builder.
        </div>
      )}
      {started === "error" && (
        <div
          className="rounded-md px-3 py-2 text-sm"
          style={{
            background: "rgba(255,107,107,0.12)",
            border: "1px solid rgba(255,107,107,0.35)",
            color: "var(--text)",
          }}
          role="alert"
        >
          Please enter an app name to continue.
        </div>
      )}
    </form>
  )
}

function SmallFeatures() {
  return (
    <div className="mt-8 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
      {[
        {
          title: "Drag & Drop UI",
          body: "Design visually on a canvas with components.",
        },
        {
          title: "AI Code Generation",
          body: "Get clean React + Tailwind and a secure backend.",
        },
        {
          title: "One‑Click Deploy",
          body: "Ship frontend to Vercel and backend to Supabase/Render.",
        },
      ].map((f, i) => (
        <div
          key={i}
          className="rounded-lg p-4"
          style={{
            background: "rgba(27,94,104,0.22)",
            border: "1px solid rgba(229,242,233,0.12)",
          }}
        >
          <h3 className="mb-1 font-medium text-[var(--text)]">{f.title}</h3>
          <p className="text-sm leading-relaxed text-[color:rgba(229,242,233,0.8)]">{f.body}</p>
        </div>
      ))}
    </div>
  )
}

function FooterNote() {
  return (
    <p className="mt-10 text-xs leading-relaxed text-[color:rgba(229,242,233,0.7)]">
      Phase 1 focuses on this mesmerizing homepage. Phase 2 brings the visual builder, AI code generation, database/API
      generation, and deployment pipeline — keeping this vibrant aesthetic throughout.
    </p>
  )
}
