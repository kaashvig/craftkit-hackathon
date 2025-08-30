"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeployPage() {
  const router = useRouter()
  const [projectName, setProjectName] = useState('my-craft-kit-app')
  const [platform, setPlatform] = useState('vercel')
  const [deploymentStatus, setDeploymentStatus] = useState('')
  const [deploymentUrl, setDeploymentUrl] = useState('')
  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeploy = async () => {
    setIsDeploying(true)
    setDeploymentStatus('Preparing deployment...')
    
    try {
      const response = await fetch('http://localhost:5000/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          platform,
          code: '// Generated app code here'
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setDeploymentStatus('✅ Deployment Successful!')
        setDeploymentUrl(data.deploymentUrl)
      } else {
        setDeploymentStatus('❌ Deployment Failed')
      }
    } catch (error) {
      console.error('Deployment error:', error)
      setDeploymentStatus('❌ Deployment Service Unavailable')
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 to-red-900 p-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
      >
        ← Back to Home
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🚀 One-Click Deploy
        </h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Configuration */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Deployment Config</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-orange-400 outline-none"
                    placeholder="my-awesome-app"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-orange-400 outline-none"
                  >
                    <option value="vercel" className="text-black">Vercel</option>
                    <option value="netlify" className="text-black">Netlify</option>
                    <option value="render" className="text-black">Render</option>
                  </select>
                </div>
                
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105"
                >
                  {isDeploying ? '🚀 Deploying...' : '🚀 Deploy Now'}
                </button>
              </div>
            </div>
            
            {/* Status */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Deployment Status</h2>
              
              <div className="bg-black/30 rounded-lg p-6 min-h-48">
                {deploymentStatus && (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white mb-4">
                      {deploymentStatus}
                    </p>
                    
                    {deploymentUrl && (
                      <div>
                        <p className="text-white/80 mb-2">Your app is live at:</p>
                        <a
                          href={deploymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          🌐 View Live App
                        </a>
                      </div>
                    )}
                  </div>
                )}
                
                {!deploymentStatus && (
                  <p className="text-white/60 text-center pt-16">
                    Click "Deploy Now" to start deployment...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
