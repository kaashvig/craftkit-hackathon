"use client"

import React from "react"
import ProximityIcons from "./proximity-icons"
import { cn } from "@/lib/utils"

export default function HeroSection() {
  return (
    <header className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-16 text-center md:py-24">
      <Badge>Craft-Kit AI</Badge>
      <h1 className="text-balance font-sans text-4xl font-semibold leading-tight text-[var(--text)] md:text-6xl">
        Build a production-ready full-stack app
        <br />
        from an idea — in minutes
      </h1>
      <p className="text-pretty max-w-2xl text-base leading-relaxed text-[color:rgba(229,242,233,0.85)] md:text-lg">
        Visually design your app. Generate clean React + Tailwind code, a secure backend, and deploy with one click.
        Vibrant, powerful, and truly yours.
      </p>

      {/* Floating icons */}
      <ProximityIcons />

      {/* Removed Start Building (AppNameForm) */}

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
          title: "One-Click Deploy",
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
      HOPE YOU HAVE A GOOD DAY
    </p>
  )
}
