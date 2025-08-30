"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GeneratePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 p-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
      >
        ← Back to Home
      </button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🤖 AI Code Generation
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Describe Your App</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build... e.g., 'A student management system with login, dashboard, and grade tracking'"
              className="w-full h-40 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 resize-none focus:ring-2 focus:ring-green-400 outline-none"
            />
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-4 w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              {isGenerating ? '🤖 Generating Code...' : '⚡ Generate Code'}
            </button>
          </div>
          
          {/* Output Panel */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Generated Code</h2>
            <div className="bg-black/30 rounded-lg p-4 h-80 overflow-auto">
              {generatedCode ? (
                <pre className="text-green-300 text-sm whitespace-pre-wrap">
                  {generatedCode}
                </pre>
              ) : (
                <p className="text-white/60 text-center pt-20">
                  Generated code will appear here...
                </p>
              )}
            </div>
            
            {generatedCode && (
              <button
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                📋 Copy Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
