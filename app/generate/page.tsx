"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GeneratePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [isClient, setIsClient] = useState(false)

  // Only set client flag after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    if (!isClient) return
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isClient])

  // Generate particles only after client mount
  useEffect(() => {
    if (!isClient) return
    
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 3 + Math.random() * 4
    }))
    setParticles(generatedParticles)
  }, [isClient])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: [{ type: 'custom', prompt: prompt }],
          framework: 'react',
          projectName: 'AI-Generated-App'
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setGeneratedCode(data.code)
      }
    } catch (error) {
      console.error('Code generation error:', error)
      setGeneratedCode('// Error generating code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const clearCode = () => {
    setGeneratedCode('')
    setPrompt('')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse opacity-75" style={{ animationDelay: '1000ms' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse opacity-75" style={{ animationDelay: '2000ms' }}></div>
        
        {/* Moving Gradient Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-slide-right"></div>
          <div className="absolute top-32 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-slide-left" style={{ animationDelay: '1000ms' }}></div>
          <div className="absolute top-64 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent animate-slide-right" style={{ animationDelay: '2000ms' }}></div>
        </div>
        
        {/* Floating Particles - Only render on client */}
        {isClient && (
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animationDelay: `${particle.animationDelay}s`,
                  animationDuration: `${particle.animationDuration}s`
                }}
              ></div>
            ))}
          </div>
        )}
        
        {/* Interactive Mouse Glow - Only render on client */}
        {isClient && (
          <div 
            className="absolute w-96 h-96 bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
            style={{
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
              transform: 'translate3d(0, 0, 0)'
            }}
          ></div>
        )}
      </div>
      
      {/* Glass Navigation */}
      <div className="relative z-10 bg-black/10 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => router.push('/')}
              className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 backdrop-blur-xl text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/10"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-white/60 text-sm font-medium border border-white/10">
                Craft-Kit AI ✨
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Animated Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-8 animate-fade-in-up">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center animate-spin-slow">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur opacity-20 animate-pulse"></div>
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              AI Code Generation
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Transform your ideas into production-ready code with the power of artificial intelligence
          </p>
          
          {/* Status Indicators */}
          <div className="flex justify-center gap-6 mt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-xl rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">AI Online</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-xl rounded-full border border-blue-500/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '500ms' }}></div>
              <span className="text-blue-300 text-sm font-medium">Ready to Generate</span>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Enhanced Input Panel */}
          <div className="group animate-fade-in-left">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:border-purple-500/30 hover:bg-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-20 animate-pulse"></div>
                </div>
                <h2 className="text-3xl font-bold text-white">Describe Your Vision</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/90 text-base font-semibold mb-3">
                    What would you like to build?
                  </label>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="✨ Describe your dream application... e.g., 'A modern e-commerce platform with user authentication, shopping cart, payment integration, and admin dashboard'"
                      className="w-full h-56 p-6 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 hover:bg-white/15 backdrop-blur-xl"
                      maxLength={2000}
                    />
                    <div className="absolute bottom-4 right-4 text-white/40 text-sm font-medium">
                      {prompt.length}/2000
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex-1 group relative px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-2xl hover:shadow-purple-500/25 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Generating Magic...
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate Code
                        </>
                      )}
                    </div>
                  </button>
                  
                  {(prompt || generatedCode) && (
                    <button
                      onClick={clearCode}
                      className="px-6 py-5 bg-white/10 hover:bg-red-500/20 text-white rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl border border-white/10 hover:border-red-500/30"
                      title="Clear all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Output Panel */}
          <div className="group animate-fade-in-right">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:border-blue-500/30 hover:bg-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-20 animate-pulse"></div>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Generated Code</h2>
                </div>
                
                {generatedCode && (
                  <button
                    onClick={handleCopyCode}
                    className={`px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-xl border ${
                      copySuccess 
                        ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/10 hover:border-white/30'
                    }`}
                  >
                    {copySuccess ? (
                      <span className="flex items-center gap-2 font-semibold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 font-semibold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Code
                      </span>
                    )}
                  </button>
                )}
              </div>
              
              <div className="relative">
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 h-[28rem] overflow-auto shadow-inner">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center animate-pulse">
                        <div className="relative mb-8">
                          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto animate-spin-slow">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Crafting Your Code</h3>
                        <p className="text-white/60 text-lg">Our AI is working its magic...</p>
                        <div className="flex justify-center gap-2 mt-6">
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        </div>
                      </div>
                    </div>
                  ) : generatedCode ? (
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4 text-green-400 text-sm font-medium">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Code Generation Complete
                      </div>
                      <pre className="text-green-300 text-sm whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                        {generatedCode}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div className="animate-fade-in">
                        <div className="relative mb-8">
                          <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-xl border border-white/10">
                            <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </div>
                          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl animate-pulse"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Ready to Create</h3>
                        <p className="text-white/60 text-lg">Your generated code will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Tips Section */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Pro Tips for Better Results</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🎯", title: "Be Specific", desc: "Detail the exact features and functionality you need" },
                { icon: "🎨", title: "Mention Style", desc: "Describe your preferred UI/UX design approach" },
                { icon: "⚡", title: "Tech Stack", desc: "Specify frameworks, libraries, or technologies" },
                { icon: "📱", title: "Responsive", desc: "Mention if you need mobile-friendly designs" }
              ].map((tip, index) => (
                <div key={index} className="group p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/10">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{tip.icon}</div>
                  <h4 className="text-white font-bold text-lg mb-2">{tip.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes slide-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100vw); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-slide-right { animation: slide-right 8s linear infinite; }
        .animate-slide-left { animation: slide-left 8s linear infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in-left { animation: fade-in-left 0.8s ease-out forwards; }
        .animate-fade-in-right { animation: fade-in-right 0.8s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
