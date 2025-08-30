"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DeployPage() {
  const router = useRouter()
  const [projectName, setProjectName] = useState('my-craft-kit-app')
  const [platform, setPlatform] = useState('vercel')
  const [deploymentStatus, setDeploymentStatus] = useState('')
  const [deploymentUrl, setDeploymentUrl] = useState('')
  const [isDeploying, setIsDeploying] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Mouse tracking for glowing effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleDeploy = async () => {
    setIsDeploying(true)
    setDeploymentStatus('Preparing deployment...')
    setDeploymentUrl('')

    try {
      const res = await fetch('http://localhost:5000/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, platform, code: '// Generated app code here' })
      })
      const data = await res.json()
      if (data.success) {
        setDeploymentStatus('✅ Deployment Successful!')
        setDeploymentUrl(data.deploymentUrl)
      } else {
        setDeploymentStatus('❌ Deployment Failed')
      }
    } catch (err) {
      console.error(err)
      setDeploymentStatus('❌ Deployment Service Unavailable')
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-900 via-blue-900 to-cyan-800 p-8">
      {/* Glowing Mouse Circle */}
      <div
        className="absolute w-80 h-80 bg-gradient-radial from-cyan-400/30 via-teal-400/20 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-300"
        style={{ left: mousePos.x - 160, top: mousePos.y - 160 }}
      />

      {/* Floating Particles */}
      {[...Array(25)].map((_, i) => (
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

        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 text-center mb-12 animate-fade-in-up">
          🚀 One-Click Deploy
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Deployment Config Panel */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 animate-fade-in-left">
            <h2 className="text-2xl font-bold text-white mb-6">Deployment Config</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-app"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
                >
                  <option value="vercel" className="text-black">Vercel</option>
                  <option value="netlify" className="text-black">Netlify</option>
                  <option value="render" className="text-black">Render</option>
                </select>
              </div>

              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:via-teal-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                {isDeploying ? '🚀 Deploying...' : '🚀 Deploy Now'}
              </button>
            </div>
          </div>

          {/* Deployment Status Panel */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 animate-fade-in-right">
            <h2 className="text-2xl font-bold text-white mb-6">Deployment Status</h2>
            <div className="bg-black/40 rounded-xl p-6 min-h-48 shadow-inner">
              {deploymentStatus ? (
                <div className="text-center">
                  <p className="text-lg font-semibold text-white mb-4">{deploymentStatus}</p>
                  {deploymentUrl && (
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all"
                    >
                      🌐 View Live App
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-white/60 text-center pt-16">
                  Click "Deploy Now" to start deployment...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
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
