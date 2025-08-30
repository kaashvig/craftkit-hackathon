"use client"

import { cn } from "@/lib/utils"
import type React from "react"

type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function GlowButton({ className, children, ...props }: GlowButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium transition",
        "text-[var(--bg)]",
        "bg-[var(--accent)] shadow-[0_0_0_0_rgba(255,107,107,0.0)]",
        "hover:shadow-[0_0_30px_6px_rgba(255,107,107,0.45)] hover:translate-y-[-1px]",
        "active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--highlight)]",
        className,
      )}
      style={{
        textShadow: "0 0 12px rgba(229,242,233,0.35)",
      }}
    >
      {/* Shine sweep (off-white) */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg" aria-hidden="true">
        <span className="absolute inset-0 translate-x-[-150%] bg-[linear-gradient(120deg,transparent,rgba(229,242,233,0.35),transparent)] opacity-0 transition duration-700 group-hover:translate-x-[150%] group-hover:opacity-100" />
      </span>
      {/* Subtle underline glow (coral) */}
      <span
        className="pointer-events-none absolute -bottom-2 left-1/2 h-1 w-2/3 -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgba(255,107,107,0.6), transparent)",
          filter: "blur(6px)",
        }}
        aria-hidden="true"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  )
}
