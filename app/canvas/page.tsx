"use client"

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface CanvasImage {
  id: number
  src: string
  x: number
  y: number
  width: number
  height: number
  alt: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function CanvasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [appName, setAppName] = useState('')
  const [images, setImages] = useState<CanvasImage[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [isAddingImage, setIsAddingImage] = useState(false)
  const [draggedImage, setDraggedImage] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  // AI Assistant states
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Welcome to your blank canvas! I can help you find images, suggest layouts, or provide design advice. What would you like to create?', timestamp: new Date() }
  ])
  const [isAITyping, setIsAITyping] = useState(false)

  useEffect(() => {
    const appParam = searchParams.get('app')
    if (appParam) {
      setAppName(appParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
    }
  }, [searchParams])

  const addImageFromUrl = async () => {
    if (!imageUrl.trim()) return
    
    setIsAddingImage(true)
    
    try {
      // Test if image URL is valid
      const img = new Image()
      img.crossOrigin = "anonymous"
      
      img.onload = () => {
        const newImage: CanvasImage = {
          id: Date.now(),
          src: imageUrl,
          x: Math.random() * 400 + 50,
          y: Math.random() * 300 + 50,
          width: Math.min(img.naturalWidth, 200),
          height: Math.min(img.naturalHeight, 200),
          alt: `Image ${images.length + 1}`
        }
        
        setImages(prev => [...prev, newImage])
        setImageUrl("")
        addChatMessage('assistant', `Great! I've added your image to the canvas. You can drag it around to position it where you'd like.`)
        setIsAddingImage(false)
      }
      
      img.onerror = () => {
        addChatMessage('assistant', 'Sorry, I couldn\'t load that image. Please check the URL and make sure it\'s a valid image link.')
        setIsAddingImage(false)
      }
      
      img.src = imageUrl
    } catch (error) {
      addChatMessage('assistant', 'There was an error loading the image. Please try a different URL.')
      setIsAddingImage(false)
    }
  }

  const startDragging = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    setDraggedImage(id)
    const rect = e.currentTarget.getBoundingClientRect()
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect()
    if (parentRect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggedImage === null) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const newX = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 200))
    const newY = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 150))
    
    setImages(prev => prev.map(img => 
      img.id === draggedImage ? { ...img, x: newX, y: newY } : img
    ))
  }

  const stopDragging = () => {
    setDraggedImage(null)
  }

  const removeImage = (id: number) => {
    setImages(prev => prev.filter(img => img.id !== id))
    addChatMessage('assistant', 'Image removed from canvas.')
  }

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
          projectContext: { 
            appName, 
            imagesCount: images.length,
            canvasContext: 'image-canvas'
          },
          conversationHistory: chatMessages.slice(-10)
        }),
      })
      
      const data = await response.json()
      if (data.success) {
        let aiResponse = data.message
        
        // Add context-specific suggestions
        if (chatInput.toLowerCase().includes('image') || chatInput.toLowerCase().includes('picture')) {
          aiResponse += "\n\n💡 Try searching for free images on Unsplash, Pexels, or Pixabay. Just copy the image URL and paste it above!"
        }
        
        addChatMessage('assistant', aiResponse)
      } else {
        addChatMessage('assistant', 'I apologize, but I\'m having trouble right now. Please try again.')
      }
    } catch (err) {
      console.error("AI chat error:", err)
      addChatMessage('assistant', 'I\'m currently offline. Please check your connection and try again.')
    } finally {
      setIsAITyping(false)
    }
  }

  const addChatMessage = (role: 'user' | 'assistant', content: string) => {
    setChatMessages(prev => [...prev, { role, content, timestamp: new Date() }])
  }

  const suggestImages = () => {
    const suggestions = [
      "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=400",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400", 
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400"
    ]
    
    addChatMessage('assistant', `Here are some sample images you can try:\n\n${suggestions.map((url, i) => `${i + 1}. ${url}`).join('\n\n')}\n\nJust copy any URL above and paste it in the "Add Image" field!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-300"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-white">
            {appName || "My Canvas"}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={suggestImages}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            🖼️ Suggest Images
          </button>
          <button
            onClick={() => setImages([])}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            🗑️ Clear Canvas
          </button>
        </div>
      </div>

      {/* Image URL Input */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
        <div className="flex gap-4 items-center">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL here... (e.g., https://example.com/image.jpg)"
            className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 outline-none"
            onKeyPress={(e) => e.key === 'Enter' && addImageFromUrl()}
          />
          <button
            onClick={addImageFromUrl}
            disabled={!imageUrl.trim() || isAddingImage}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            {isAddingImage ? '⏳ Adding...' : '➕ Add Image'}
          </button>
        </div>
        <p className="text-white/60 text-sm mt-2">
          💡 Tip: Use direct image links from Unsplash, Pexels, or any public image URL
        </p>
      </div>

      {/* Canvas */}
      <div
        className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        style={{ height: 600, minHeight: 600 }}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        {/* Canvas Grid Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Canvas Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="text-white font-semibold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg">
            Canvas ({images.length} images)
          </div>
          {images.length === 0 && (
            <div className="text-white/60 text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg">
              Add images using URLs above
            </div>
          )}
        </div>

        {/* Images */}
        {images.map((image) => (
          <div
            key={image.id}
            className={`absolute cursor-move group transition-all duration-200 ${draggedImage === image.id ? 'scale-105 shadow-2xl z-50' : 'hover:scale-102'}`}
            style={{ left: image.x, top: image.y }}
            onMouseDown={(e) => startDragging(image.id, e)}
          >
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="rounded-lg shadow-lg border-2 border-white/20 group-hover:border-white/50 transition-all duration-200"
              draggable={false}
            />
            
            {/* Remove button */}
            <button
              onClick={() => removeImage(image.id)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {/* Empty State */}
        {images.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold mb-2">Your Blank Canvas</h3>
              <p>Add images by pasting URLs above or ask the AI assistant for suggestions</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Chat Assistant */}
      <div className={`fixed bottom-4 right-4 w-80 bg-black/90 backdrop-blur-sm rounded-xl shadow-2xl transition-all duration-300 ${chatOpen ? "h-96" : "h-12"} z-40`}>
        <div 
          className="flex justify-between items-center cursor-pointer p-3 border-b border-gray-700" 
          onClick={() => setChatOpen(!chatOpen)}
        >
          <span className="text-white font-bold flex items-center">
            🤖 Canvas AI Assistant
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
                  <div className="ml-6 mt-1 whitespace-pre-line">{msg.content}</div>
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
                  placeholder="Ask for image suggestions, design tips..."
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

export default function CanvasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading canvas...</div>
      </div>
    }>
      <CanvasContent />
    </Suspense>
  )
}
