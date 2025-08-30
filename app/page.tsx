import type React from "react"
import AnimatedBackground from "@/components/animated-background"
import HeroSection from "@/components/hero-section"

export default function HomePage() {
  // Define palette as CSS variables to keep exactly 5 colors (Submerged City)
  // --bg: navy, --card: teal, --accent: coral, --highlight: lime, --text: off-white
  return (
    <main
      className="relative min-h-dvh overflow-hidden"
      style={
        {
          // Color variables
          ["--bg" as any]: "#0A1931",
          ["--card" as any]: "#1B5E68",
          ["--accent" as any]: "#FF6B6B",
          ["--highlight" as any]: "#B9FF14",
          ["--text" as any]: "#E5F2E9",
        } as React.CSSProperties
      }
    >
      <AnimatedBackground />
      <div className="relative z-10">
        <HeroSection />
      </div>
    </main>
  )
}
