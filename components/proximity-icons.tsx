"use client"

import { Cpu, Layers, Server, Zap } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

// --- ICON CONFIGURATION ---
const icons = [
  { name: "Cpu", Comp: Cpu, x: 10, y: 10 },
  { name: "Layers", Comp: Layers, x: 85, y: 18 },
  { name: "Server", Comp: Server, x: 18, y: 78 },
  { name: "Zap", Comp: Zap, x: 88, y: 78 },
]

export default function ProximityCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<{ x: number; y: number; size: number }[]>([])
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatLog, setChatLog] = useState<string[]>([])
  const [components, setComponents] = useState<{ id: number; name: string; x: number; y: number }[]>([])
  const [draggingButton, setDraggingButton] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })

  // --- MOUSE TRACKING ---
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      if (draggingButton) {
        setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }
    }
    const onLeave = () => setMouse({ x: -9999, y: -9999 })
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [draggingButton])

  // --- PARTICLE BACKGROUND ---
  useEffect(() => {
    const arr = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
    }))
    setParticles(arr)
  }, [])

  // --- ADD COMPONENT TO CANVAS ---
  const addComponent = (name: string, x: number = 50, y: number = 50) => {
    const id = Date.now()
    setComponents(prev => [...prev, { id, name, x, y }])
  }

  // --- AI CHAT HANDLER ---
  const handleChatSend = async () => {
    if (!chatInput.trim()) return
    setChatLog([...chatLog, `You: ${chatInput}`])
    try {
      const response = await fetch("http://localhost:5000/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      })
      const data = await response.json()
      setChatLog(prev => [...prev, `AI: ${data.reply}`])
      setChatInput("")
    } catch (err) {
      console.error("AI chat error:", err)
    }
  }

  // --- DEPLOY APP ---
  const deployApp = async () => {
    try {
      const res = await fetch("/api/deploy", { method: "POST" })
      const data = await res.json()
      alert(data.message || "Deployment started!")
    } catch (err) {
      console.error(err)
      alert("Deployment failed!")
    }
  }

  // --- HANDLE BUTTON DROP ---
  const handleDropButton = () => {
    if (draggingButton) {
      addComponent(draggingButton, dragPos.x, dragPos.y)
      setDraggingButton(null)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[600px] w-full max-w-6xl bg-gradient-to-r from-purple-900 via-indigo-900 to-black rounded-xl overflow-hidden shadow-xl"
      onMouseUp={handleDropButton}
    >
      {/* Background particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-green-400 opacity-50 animate-pulse"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, filter: "blur(2px)" }}
        />
      ))}

      {/* Navbar buttons / Features */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-6 z-50">
        <DraggableFeatureButton label="Drag & Drop UI" onDragStart={() => setDraggingButton("Drag & Drop UI")} />
        <DraggableFeatureButton label="AI Code Generation" onDragStart={() => setDraggingButton("AI Code Generation")} />
        <DraggableFeatureButton label="One-Click Deploy" onDragStart={() => setDraggingButton("One-Click Deploy")} onClick={deployApp} />
      </div>

      {/* Render dragging button */}
      {draggingButton && (
        <div className="absolute pointer-events-none text-white font-bold px-4 py-2 rounded-lg bg-purple-700 shadow-lg" style={{ left: dragPos.x, top: dragPos.y }}>
          {draggingButton}
        </div>
      )}

      {/* Proximity icons */}
      {icons.map(({ name, Comp, x, y }, i) => (
        <IconAt key={i} name={name} Comp={Comp} left={`${x}%`} top={`${y}%`} mouse={mouse} addComponent={addComponent} />
      ))}

      {/* Draggable canvas components */}
      {components.map(c => (
        <DraggableComponent key={c.id} comp={c} setComponents={setComponents} />
      ))}

      {/* AI Chat assistant */}
      <div className={`fixed bottom-4 right-4 w-64 bg-black bg-opacity-80 rounded-xl p-2 shadow-lg transition-all ${chatOpen ? "h-80" : "h-12"}`}>
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setChatOpen(!chatOpen)}>
          <span className="text-white font-bold">AI Assistant</span>
          <span className="text-green-400">{chatOpen ? "−" : "+"}</span>
        </div>
        {chatOpen && (
          <div className="mt-2 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto text-white text-sm space-y-1">
              {chatLog.map((msg, idx) => (
                <div key={idx}>{msg}</div>
              ))}
            </div>
            <div className="mt-2 flex">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 rounded-l px-2 py-1 text-black"
                placeholder="Ask AI..."
              />
              <button onClick={handleChatSend} className="bg-green-400 px-3 rounded-r">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- DRAGGABLE FEATURE BUTTON ---
type DraggableFeatureButtonProps = {
  label: string
  onDragStart: () => void
  onClick?: () => void
}
function DraggableFeatureButton({ label, onDragStart, onClick }: DraggableFeatureButtonProps) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseDown={onDragStart}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`px-5 py-2 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg`}
      style={{
        background: hover ? "linear-gradient(90deg, #7F00FF, #E100FF)" : "linear-gradient(90deg, #6B21A8, #4C1D95)",
        transform: hover ? "scale(1.1)" : "scale(1)",
        boxShadow: hover ? "0 0 20px rgba(255,255,255,0.6)" : "0 0 10px rgba(0,0,0,0.4)",
      }}
    >
      {label}
    </button>
  )
}

// --- ICON COMPONENT ---
type IconAtProps = {
  name: string
  Comp: React.ComponentType<any>
  left: string
  top: string
  mouse: { x: number; y: number }
  addComponent: (name: string) => void
}
function IconAt({ name, Comp, left, top, mouse, addComponent }: IconAtProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [glowColor, setGlowColor] = useState("rgba(185,255,20,0.5)")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    const dx = mouse.x + rect.left - center.x
    const dy = mouse.y + rect.top - center.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const influence = Math.max(0, 1 - dist / 220)
    const tx = (dx / (dist || 1)) * influence * -12
    const ty = (dy / (dist || 1)) * influence * -12
    const scale = 1 + influence * 0.35
    const glow = influence * 0.7
    const hue = 120 + influence * 60
    setGlowColor(`hsla(${hue}, 100%, 60%, ${0.25 + glow * 0.55})`)
    setStyle({
      transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      filter: `drop-shadow(0 0 ${8 + glow * 15}px ${glowColor})`,
      transition: "transform 0.2s ease-out, filter 0.2s ease-out",
    })
  }, [mouse, glowColor])

  const handleClick = () => addComponent(name)
  return (
    <div ref={ref} className="absolute cursor-pointer" style={{ left, top }} onClick={handleClick}>
      <Comp size={52} strokeWidth={1.8} style={{ color: "var(--text)", stroke: "var(--highlight)", fill: "transparent", ...style }} />
    </div>
  )
}

// --- DRAGGABLE CANVAS COMPONENT ---
type DraggableProps = {
  comp: { id: number; name: string; x: number; y: number }
  setComponents: React.Dispatch<React.SetStateAction<{ id: number; name: string; x: number; y: number }[]>>
}
function DraggableComponent({ comp, setComponents }: DraggableProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [pos, setPos] = useState({ x: comp.x, y: comp.y })

  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); setDragging(true) }
  const onMouseUp = () => setDragging(false)
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    const newX = e.clientX - 100
    const newY = e.clientY - 100
    setPos({ x: newX, y: newY })
    setComponents(prev => prev.map(c => (c.id === comp.id ? { ...c, x: newX, y: newY } : c)))
  }

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className="absolute cursor-move bg-purple-700 text-white px-3 py-2 rounded-lg select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      {comp.name}
    </div>
  )
}
