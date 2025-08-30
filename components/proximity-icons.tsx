"use client"

import { Cpu, Layers, Server, Zap } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const icons = [
  { name: "Cpu", Comp: Cpu },
  { name: "Layers", Comp: Layers },
  { name: "Server", Comp: Server },
  { name: "Zap", Comp: Zap },
]

export default function ProximityCanvas() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; vx: number; vy: number }[]>([])

  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I’m your AI assistant. I can help you with your app.", timestamp: new Date() }
  ])
  const [isAITyping, setIsAITyping] = useState(false)

  // Mouse movement
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    const onLeave = () => setMouse({ x: -9999, y: -9999 })
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  // Particles
  useEffect(() => {
    const arr = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    }))
    setParticles(arr)

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.vx + 100) % 100,
        y: (p.y + p.vy + 100) % 100,
      })))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handleDragDropUI = () => router.push("/builder")
  const handleAICodeGeneration = () => router.push("/generate")
  const handleDeploy = () => router.push("/deploy")
  const handleChatSend = async () => {
    if (!chatInput.trim()) return
    const userMessage: ChatMessage = { role: "user", content: chatInput, timestamp: new Date() }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsAITyping(true)
    try {
      const response = await fetch("http://localhost:5000/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput, projectContext: {}, conversationHistory: chatMessages.slice(-10) }),
      })
      const data = await response.json()
      addChatMessage(data.success ? "assistant" : "assistant", data.success ? data.message : "Error")
    } catch {
      addChatMessage("assistant", "AI offline")
    } finally { setIsAITyping(false) }
  }
  const addChatMessage = (role: "user" | "assistant", content: string) => {
    setChatMessages(prev => [...prev, { role, content, timestamp: new Date() }])
  }

  return (
    <div ref={containerRef} className="relative mx-auto h-[700px] w-full max-w-full overflow-hidden">
      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} className="absolute rounded-full bg-cyan-400/40 animate-pulse blur-sm z-0"
          style={{ width: p.size*2, height: p.size*2, left: `${p.x}%`, top: `${p.y}%`, transition:'all 0.1s linear' }} />
      ))}

      {/* Bottom Panel */}
      <div className="absolute bottom-40 left-0 w-full flex justify-center z-20 /70 backdrop-blur-md px-10 py-6 shadow-2xl">
        <div className="flex gap-8 w-full max-w-6xl justify-around">
          <button onClick={handleDragDropUI} className="px-12 py-6 bg-gradient-to-tr from-indigo-500/40 via-purple-600/40 to-pink-500/40 text-white font-bold rounded-2xl hover:scale-110 hover:shadow-[0_0_35px_#00fff0] transition-transform text-2xl">
            🎨 UI Builder
          </button>
          <button onClick={handleAICodeGeneration} className="px-12 py-6 bg-gradient-to-tr from-indigo-500/40 via-purple-600/40 to-pink-500/40 text-white font-bold rounded-2xl hover:scale-110 hover:shadow-[0_0_35px_#00fff0] transition-transform text-2xl">
            🤖 AI Code
          </button>
          <button onClick={handleDeploy} className="px-12 py-6 bg-gradient-to-tr from-indigo-500/40 via-purple-600/40 to-pink-500/40 text-white font-bold rounded-2xl hover:scale-110 hover:shadow-[0_0_35px_#00fff0] transition-transform text-2xl">
            🚀 Deploy
          </button>
        </div>
      </div>

      {/* Floating Icons Horizontally */}
      {icons.map((item, idx) => (
        <FloatingIcon key={idx} Comp={item.Comp} mouse={mouse} index={idx} total={icons.length} />
      ))}

      {/* Chat Panel */}
      <div className={`fixed bottom-6 right-6 w-80 bg-black/80 backdrop-blur-md rounded-xl shadow-2xl transition-all duration-300 ${chatOpen ? "h-96" : "h-14"} z-50 ring-2 ring-cyan-500/40`}>
        <div className="flex justify-between items-center cursor-pointer p-3 border-b border-cyan-600/40" onClick={() => setChatOpen(!chatOpen)}>
          <span className="text-white font-bold flex items-center gap-2">
            🤖 AI Assistant {isAITyping && <span className="text-cyan-400 animate-pulse">●</span>}
          </span>
          <span className="text-cyan-400 text-xl font-bold">{chatOpen ? "−" : "+"}</span>
        </div>
        {chatOpen && (
          <div className="flex flex-col h-80">
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`${msg.role==="user"?"text-blue-300":"text-white"} text-sm`}>
                  <span className="font-semibold">{msg.role==="user"?"👤 You:":"🤖 AI:"}</span>
                  <div className="ml-6 mt-1">{msg.content}</div>
                </div>
              ))}
              {isAITyping && <div className="text-gray-400 text-sm animate-pulse">🤖 AI is thinking...</div>}
            </div>
            <div className="p-3 border-t border-cyan-600/40">
              <div className="flex">
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                  onKeyPress={e=>e.key==='Enter'&&!e.shiftKey&&handleChatSend()}
                  className="flex-1 rounded-l px-3 py-2 text-black bg-white/90 border-0 focus:ring-2 focus:ring-cyan-400 outline-none"
                  placeholder="Ask AI..."
                  disabled={isAITyping} />
                <button onClick={handleChatSend} disabled={isAITyping||!chatInput.trim()} className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 px-4 py-2 rounded-r text-white font-semibold transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Floating Icon Component
interface FloatingIconProps {
  Comp: React.ComponentType<any>
  mouse: { x: number; y: number }
  index: number
  total: number
}

function FloatingIcon({ Comp, mouse, index, total }: FloatingIconProps) {
  const [style, setStyle] = useState<React.CSSProperties>({})

  const leftPct = 10 + index * (80 / (total - 1 || 1)) // spread horizontally 10% → 90%
  const topPct = 20 // fixed vertical position near top

  useEffect(() => {
    const dx = mouse.x - (leftPct / 100 * window.innerWidth)
    const dy = mouse.y - (topPct / 100 * window.innerHeight)
    const dist = Math.sqrt(dx*dx+dy*dy)
    const influence = Math.max(0,1-dist/250)
    const tx = (dx/(dist||1))*influence*-10
    const ty = (dy/(dist||1))*influence*-10
    const scale = 1 + influence*0.3
    const glow = influence*0.6

    setStyle({
      left: `${leftPct}%`,
      top: `${topPct}%`,
      transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${influence*15}deg)`,
      filter: `drop-shadow(0 0 ${5+glow*25}px cyan)`,
      transition: "transform 0.15s ease-out, filter 0.15s ease-out",
      position: "absolute",
      zIndex: 10,
    })
  }, [mouse, leftPct, topPct])

  return (
    <div className="animate-[float_4s_ease-in-out_infinite] hover:scale-125 hover:drop-shadow-[0_0_30px_cyan]" style={style}>
      <Comp size={60} strokeWidth={1.5} style={{ color:"rgba(255,255,255,0.95)", fill:"transparent" }} />
    </div>
  )
}
