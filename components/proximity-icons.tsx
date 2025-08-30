"use client"

import { Cpu, Layers, Server, Zap } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'

// --- COMPONENT TYPES ---
interface Component {
  id: number
  name: string
  type: string
  x: number
  y: number
  props?: Record<string, any>
  styles?: Record<string, any>
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// --- ICON CONFIGURATION ---
const icons = [
  { name: "Cpu", Comp: Cpu, x: 10, y: 10 },
  { name: "Layers", Comp: Layers, x: 85, y: 18 },
  { name: "Server", Comp: Server, x: 18, y: 78 },
  { name: "Zap", Comp: Zap, x: 88, y: 78 },
]

export default function ProximityCanvas() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; vx: number; vy: number }[]>([])
  
  // Chat states
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I\'m your AI assistant. I can help you build your app, generate code, and answer questions about your project.', timestamp: new Date() }
  ])
  const [isAITyping, setIsAITyping] = useState(false)

  // --- MOUSE TRACKING ---
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

  // --- ANIMATED PARTICLE BACKGROUND ---
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

  // --- BUTTON HANDLERS WITH REDIRECTS ---
  const handleDragDropUI = () => {
    // You can redirect to a dedicated drag-drop page
    router.push('/builder')
    // Or open a modal/component library
    addChatMessage('assistant', 'Redirecting to the visual builder...')
  }

  const handleAICodeGeneration = () => {
    // Redirect to code generation page
    router.push('/generate')
    addChatMessage('assistant', 'Redirecting to AI code generator...')
  }

  const handleDeploy = () => {
    // Redirect to deployment page
    router.push('/deploy')
    addChatMessage('assistant', 'Redirecting to deployment dashboard...')
  }

  // --- AI CHAT HANDLER ---
  const handleChatSend = async () => {
    if (!chatInput.trim()) return
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsAITyping(true)
    
    try {
      const response = await fetch("http://localhost:5000/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: chatInput,
          projectContext: {},
          conversationHistory: chatMessages.slice(-10)
        }),
      })
      
      const data = await response.json()
      if (data.success) {
        addChatMessage('assistant', data.message)
      } else {
        addChatMessage('assistant', 'I apologize, but I\'m having trouble processing your request right now. Please try again.')
      }
    } catch (err) {
      console.error("AI chat error:", err)
      addChatMessage('assistant', 'I\'m currently offline. Please check your connection and try again.')
    } finally {
      setIsAITyping(false)
    }
  }

  // --- HELPER FUNCTIONS ---
  const addChatMessage = (role: 'user' | 'assistant', content: string) => {
    setChatMessages(prev => [...prev, { role, content, timestamp: new Date() }])
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[600px] w-full max-w-6xl bg-gradient-to-r from-purple-900 via-indigo-900 to-black rounded-xl overflow-hidden shadow-xl"
    >
      {/* Animated background particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-green-400 opacity-30 animate-pulse"
          style={{ 
            width: p.size, 
            height: p.size, 
            left: `${p.x}%`, 
            top: `${p.y}%`, 
            filter: "blur(1px)",
            transition: 'all 0.1s linear'
          }}
        />
      ))}

      {/* Main Action Buttons - Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex space-x-6">
          <ActionButton 
            label="Drag & Drop UI" 
            onClick={handleDragDropUI}
            description="Visual Builder"
          />
          <ActionButton 
            label="AI Code Generation" 
            onClick={handleAICodeGeneration}
            description="Generate Code"
          />
          <ActionButton 
            label="One-Click Deploy" 
            onClick={handleDeploy}
            description="Deploy App"
          />
        </div>
      </div>

      {/* Proximity icons */}
      {icons.map(({ name, Comp, x, y }, i) => (
        <IconAt 
          key={i} 
          name={name} 
          Comp={Comp} 
          left={`${x}%`} 
          top={`${y}%`} 
          mouse={mouse} 
        />
      ))}

      {/* Enhanced AI Chat assistant */}
      <div className={`fixed bottom-4 right-4 w-80 bg-black bg-opacity-90 rounded-xl shadow-2xl transition-all duration-300 ${chatOpen ? "h-96" : "h-12"}`}>
        <div 
          className="flex justify-between items-center cursor-pointer p-3 border-b border-gray-700" 
          onClick={() => setChatOpen(!chatOpen)}
        >
          <span className="text-white font-bold flex items-center">
            🤖 AI Assistant
            {isAITyping && <span className="ml-2 text-green-400 animate-pulse">●</span>}
          </span>
          <span className="text-green-400 text-xl font-bold">{chatOpen ? "−" : "+"}</span>
        </div>
        
        {chatOpen && (
          <div className="flex flex-col h-80">
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`${msg.role === 'user' ? 'text-blue-300' : 'text-white'} text-sm`}>
                  <span className="font-semibold">
                    {msg.role === 'user' ? '👤 You:' : '🤖 AI:'}
                  </span>
                  <div className="ml-6 mt-1">{msg.content}</div>
                </div>
              ))}
              {isAITyping && (
                <div className="text-gray-400 text-sm animate-pulse">🤖 AI is thinking...</div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-700">
              <div className="flex">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleChatSend()}
                  className="flex-1 rounded-l px-3 py-2 text-black bg-white border-0 focus:ring-2 focus:ring-green-400 outline-none"
                  placeholder="Ask AI about your project..."
                  disabled={isAITyping}
                />
                <button 
                  onClick={handleChatSend} 
                  disabled={isAITyping || !chatInput.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-r text-white font-semibold transition-colors"
                >
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

// --- ACTION BUTTON COMPONENT ---
interface ActionButtonProps {
  label: string
  onClick: () => void
  description: string
}

function ActionButton({ label, onClick, description }: ActionButtonProps) {
  const [hover, setHover] = useState(false)

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-2xl relative overflow-hidden`}
        style={{
          background: hover ? "linear-gradient(135deg, #7F00FF, #E100FF)" : "linear-gradient(135deg, #6B21A8, #4C1D95)",
          transform: hover ? "scale(1.05) translateY(-5px)" : "scale(1)",
          boxShadow: hover ? "0 20px 40px rgba(127,0,255,0.4)" : "0 10px 20px rgba(0,0,0,0.3)",
        }}
      >
        {hover && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
        )}
        <span className="relative z-10">{label}</span>
      </button>
      
      {/* Description tooltip */}
      <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black bg-opacity-80 text-white text-sm rounded whitespace-nowrap transition-opacity duration-200 ${hover ? 'opacity-100' : 'opacity-0'}`}>
        {description}
      </div>
    </div>
  )
}

// --- ENHANCED ICON COMPONENT ---
interface IconAtProps {
  name: string
  Comp: React.ComponentType<any>
  left: string
  top: string
  mouse: { x: number; y: number }
}

function IconAt({ name, Comp, left, top, mouse }: IconAtProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [glowColor, setGlowColor] = useState("rgba(185,255,20,0.5)")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const containerRect = el.closest('.relative')?.getBoundingClientRect()
    if (!containerRect) return

    const center = { 
      x: rect.left - containerRect.left + rect.width / 2, 
      y: rect.top - containerRect.top + rect.height / 2 
    }
    const dx = mouse.x - center.x
    const dy = mouse.y - center.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const influence = Math.max(0, 1 - dist / 150)
    
    const tx = (dx / (dist || 1)) * influence * -15
    const ty = (dy / (dist || 1)) * influence * -15
    const scale = 1 + influence * 0.4
    const glow = influence * 0.8
    const hue = 120 + influence * 80
    
    setGlowColor(`hsla(${hue}, 100%, 60%, ${0.3 + glow * 0.6})`)
    setStyle({
      transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      filter: `drop-shadow(0 0 ${10 + glow * 20}px ${glowColor})`,
      transition: "transform 0.15s ease-out, filter 0.15s ease-out",
    })
  }, [mouse, glowColor])

  return (
    <div 
      ref={ref} 
      className="absolute cursor-pointer hover:z-10" 
      style={{ left, top }} 
    >
      <Comp 
        size={56} 
        strokeWidth={1.5} 
        style={{ 
          color: "rgba(255,255,255,0.9)", 
          stroke: "var(--highlight)", 
          fill: "transparent", 
          ...style 
        }} 
      />
    </div>
  )
}
