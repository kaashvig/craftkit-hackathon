"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GeneratePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Track mouse for glowing effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)

    try {
      const res = await fetch('http://localhost:5000/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: [{ type: 'custom', prompt }],
          framework: 'react',
          projectName: 'AI-Generated-App'
        })
      })
      const data = await res.json()
      if (data.success) setGeneratedCode(data.code)
    } catch (err) {
      console.error(err)
      setGeneratedCode('// Error generating code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-green-900">
      {/* Glowing Mouse Circle */}
      <div
        className="absolute w-80 h-80 bg-gradient-radial from-purple-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-300"
        style={{ left: mousePos.x - 160, top: mousePos.y - 160 }}
      />

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Back Button */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => router.push('/')}
          className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 backdrop-blur-md"
        >
          ← Back to Home
        </button>

        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-400 to-green-300 text-center mb-12 animate-fade-in-up">
           AI Code Generation
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 animate-fade-in-left">
            <h2 className="text-2xl font-bold text-white mb-4">Describe Your App</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your dream app..."
              className="w-full h-44 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 resize-none focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-300"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 hover:from-purple-700 hover:via-blue-700 hover:to-green-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {isGenerating ? '🤖 Generating Code...' : '⚡ Generate Code'}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 animate-fade-in-right">
            <h2 className="text-2xl font-bold text-white mb-4">Generated Code</h2>
            <div className="bg-black/40 rounded-xl p-4 h-80 overflow-auto shadow-inner">
              {generatedCode ? (
                <pre className="text-green-300 text-sm whitespace-pre-wrap font-mono">{generatedCode}</pre>
              ) : (
                <p className="text-white/60 text-center pt-28">
                  Your generated code will appear here...
                </p>
              )}
            </div>
            {generatedCode && (
              <button
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="mt-4 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                📋 Copy Code
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
        .animate-fade-in-left { animation: fade-in-left 1s ease-out forwards; }
        .animate-fade-in-right { animation: fade-in-right 1s ease-out forwards; }

        .bg-gradient-radial { background: radial-gradient(circle, var(--tw-gradient-stops)); }
      `}</style>
    </div>
  )
}
