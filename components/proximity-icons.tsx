"use client"

import { Cpu, Layers, Server, Zap } from "lucide-react"
import React from "react"

const icons = [
  { Comp: Cpu, x: 10, y: 10 },
  { Comp: Layers, x: 85, y: 18 },
  { Comp: Server, x: 18, y: 78 },
  { Comp: Zap, x: 88, y: 78 },
]

export default function ProximityIcons() {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect()
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", () => setMouse({ x: -9999, y: -9999 }))
    return () => {
      el.removeEventListener("mousemove", onMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative mx-auto h-48 w-full max-w-4xl" aria-hidden="true">
      {icons.map(({ Comp, x, y }, i) => {
        return <IconAt key={i} Comp={Comp} left={`${x}%`} top={`${y}%`} mouse={mouse} />
      })}
    </div>
  )
}

function IconAt({
  Comp,
  left,
  top,
  mouse,
}: {
  Comp: any
  left: string
  top: string
  mouse: { x: number; y: number }
}) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [style, setStyle] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    const dx = mouse.x + rect.left - center.x
    const dy = mouse.y + rect.top - center.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Influence radius ~ 220px; closer = larger scale/offset
    const influence = Math.max(0, 1 - dist / 220)
    const tx = (dx / (dist || 1)) * influence * -10
    const ty = (dy / (dist || 1)) * influence * -10
    const scale = 1 + influence * 0.25
    const glow = influence * 0.6

    setStyle({
      transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      filter: `drop-shadow(0 0 ${8 + glow * 12}px rgba(185,255,20,${0.25 + glow * 0.55}))`,
    })
  }, [mouse])

  return (
    <div ref={ref} className="absolute" style={{ left, top, transition: "transform 0.2s ease-out" }}>
      <Comp
        size={36}
        strokeWidth={1.6}
        className="text-[var(--text)]"
        style={{
          color: "var(--text)",
          stroke: "var(--highlight)",
          fill: "transparent",
          ...style,
        }}
      />
    </div>
  )
}
