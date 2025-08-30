"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Palette, Settings, Play, Download, Trash2, Copy, 
  RotateCcw, Maximize2, Grid, Layers, Eye, EyeOff,
  Zap, Sparkles, MousePointer2, Move3D
} from 'lucide-react'

// Enhanced TypeScript Interfaces
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  hue: number;
  opacity: number;
  life: number;
}

interface Component {
  id: number;
  type: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  zIndex?: number;
  style?: {
    backgroundColor?: string;
    color?: string;
    borderRadius?: number;
    fontSize?: number;
    fontWeight?: string;
    padding?: string;
  };
  animation?: {
    type: 'none' | 'pulse' | 'bounce' | 'rotate' | 'float' | 'glow';
    duration: number;
    delay: number;
  };
}

// Fixed Animated Particles Hook
function useAdvancedParticles(count: number = 80): Particle[] {
  const [particles, setParticles] = useState<Particle[]>(() =>
    Array(count).fill(0).map((_, i) => ({
      id: i,
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 6 + 1,
      vx: (Math.random() - 0.5) * 0.004,
      vy: (Math.random() - 0.5) * 0.004,
      hue: Math.random() * 360,
      opacity: Math.random() * 0.8 + 0.2,
      life: Math.random() * 1000 + 500,
    }))
  );

  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    function animate(currentTime: number): void {
      if (currentTime - lastTimeRef.current > 16) {
        setParticles(prev =>
          prev.map(p => {
            let x = p.x + p.vx;
            let y = p.y + p.vy;
            
            const newParticle = { ...p };
            
            if (x > 1 || x < 0) {
              newParticle.vx *= -0.8;
              x = Math.max(0, Math.min(1, x));
            }
            if (y > 1 || y < 0) {
              newParticle.vy *= -0.8;
              y = Math.max(0, Math.min(1, y));
            }

            const newLife = newParticle.life - 1;
            const opacity = newLife > 100 ? newParticle.opacity : (newLife / 100) * newParticle.opacity;

            return {
              ...newParticle,
              x,
              y,
              life: newLife > 0 ? newLife : 1000,
              opacity: newLife > 0 ? opacity : Math.random() * 0.8 + 0.2,
              hue: (newParticle.hue + 0.5) % 360,
            };
          })
        );
        lastTimeRef.current = currentTime;
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return particles;
}

// Advanced Draggable Component
function AdvancedDraggableComponent({
  component,
  onDrag,
  onSelect,
  isSelected,
  canvasRef,
}: {
  component: Component;
  onDrag: (id: number, x: number, y: number) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
  canvasRef: React.RefObject<HTMLDivElement>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (component.locked) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    onSelect(component.id);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX - rect.left - component.x;
    const startY = e.clientY - rect.top - component.y;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(rect.width - (component.width || 100), e.clientX - rect.left - startX));
      const newY = Math.max(0, Math.min(rect.height - (component.height || 40), e.clientY - rect.top - startY));
      
      onDrag(component.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [component.id, component.locked, component.x, component.y, component.width, component.height, onDrag, onSelect, canvasRef]);

  const getAnimationClass = () => {
    if (!component.animation || component.animation.type === 'none') return '';
    
    switch (component.animation.type) {
      case 'pulse':
        return 'animate-pulse';
      case 'bounce':
        return 'animate-bounce';
      case 'rotate':
        return 'animate-spin';
      case 'float':
        return 'custom-animate-float';
      case 'glow':
        return 'custom-animate-glow';
      default:
        return '';
    }
  };

  const getComponentStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: component.x,
      top: component.y,
      width: component.width || 'auto',
      height: component.height || 'auto',
      transform: `rotate(${component.rotation || 0}deg) scale(${isDragging ? 1.05 : 1})`,
      opacity: component.opacity || 1,
      zIndex: component.zIndex || (isDragging ? 1000 : isSelected ? 100 : 1),
      cursor: component.locked ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
      transition: isDragging ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      display: component.visible !== false ? 'block' : 'none',
      border: isSelected ? '2px solid #00f5ff' : '2px solid transparent',
      borderRadius: '12px',
      backdropFilter: 'blur(8px)',
      ...component.style,
    };

    switch (component.type) {
      case 'button':
        return {
          ...baseStyle,
          backgroundColor: '#7c3aed',
          color: 'white',
          padding: '10px 20px',
          boxShadow: isSelected 
            ? '0 0 30px rgba(0, 245, 255, 0.5), 0 8px 32px rgba(124, 58, 237, 0.6)' 
            : '0 4px 20px rgba(124, 58, 237, 0.6)',
        };
      case 'input':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255,255,255,0.9)',
          color: '#374151',
          padding: '8px 12px',
          boxShadow: isSelected 
            ? '0 0 30px rgba(0, 245, 255, 0.5), 0 8px 32px rgba(99, 102, 241, 0.4)' 
            : '0 4px 20px rgba(99, 102, 241, 0.4)',
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(34,211,238,0.2)',
          color: 'white',
          padding: '8px 16px',
          boxShadow: isSelected 
            ? '0 0 30px rgba(0, 245, 255, 0.5), 0 8px 32px rgba(34, 211, 238, 0.4)' 
            : '0 4px 20px rgba(34, 211, 238, 0.4)',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#ec4899',
          color: 'white',
          padding: '8px 12px',
          boxShadow: isSelected 
            ? '0 0 30px rgba(0, 245, 255, 0.5), 0 8px 32px rgba(236, 72, 153, 0.6)' 
            : '0 4px 20px rgba(236, 72, 153, 0.6)',
        };
    }
  };

  return (
    <div
      ref={dragRef}
      style={getComponentStyle()}
      className={`component-item ${getAnimationClass()} ${
        component.locked ? 'opacity-75' : ''
      }`}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
    >
      {isSelected && !component.locked && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full cursor-nw-resize"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full cursor-ne-resize"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full cursor-sw-resize"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full cursor-se-resize"></div>
        </>
      )}
      
      {component.type === 'input' ? (
        <input
          type="text"
          value={component.label}
          readOnly
          className="w-full h-full bg-transparent border-none outline-none text-inherit pointer-events-none"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          {component.label}
        </div>
      )}
    </div>
  );
}

// Component Palette - COMPLETELY FIXED
function EnhancedComponentPalette({ 
  onAddComponent 
}: { 
  onAddComponent: (type: string) => void;
}) {
  const componentCategories = {
    basic: [
      { type: 'button', label: 'Button', icon: '🔘', color: '#7c3aed' },
      { type: 'input', label: 'Input', icon: '📝', color: '#6366f1' },
      { type: 'text', label: 'Text', icon: '📄', color: '#22d3ee' },
      { type: 'image', label: 'Image', icon: '🖼️', color: '#ec4899' },
    ],
    layout: [
      { type: 'card', label: 'Card', icon: '🃏', color: '#8b5cf6' },
      { type: 'divider', label: 'Divider', icon: '➖', color: '#06b6d4' },
      { type: 'container', label: 'Container', icon: '📦', color: '#f59e0b' },
      { type: 'grid', label: 'Grid', icon: '⊞', color: '#10b981' },
    ],
    interactive: [
      { type: 'slider', label: 'Slider', icon: '🎚️', color: '#ef4444' },
      { type: 'toggle', label: 'Toggle', icon: '🔄', color: '#84cc16' },
      { type: 'dropdown', label: 'Dropdown', icon: '📋', color: '#06b6d4' },
      { type: 'progress', label: 'Progress', icon: '📊', color: '#f97316' },
    ],
  } as const;

  const [activeCategory, setActiveCategory] = useState<keyof typeof componentCategories>('basic');

  return (
    <div className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Components</h2>
      </div>

      <div className="flex gap-2 mb-6">
        {(Object.keys(componentCategories) as Array<keyof typeof componentCategories>).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-cyan-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {componentCategories[activeCategory].map(({ type, label, icon, color }) => (
          <button
            key={type}
            onClick={() => onAddComponent(type)}
            className="group relative p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ 
              backgroundColor: `${color}15`,
            }}
          >
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-sm text-white font-medium">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Properties Panel
function AdvancedPropertiesPanel({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
}: {
  selectedComponent: Component | undefined;
  onUpdateComponent: (id: number, updates: Partial<Component>) => void;
  onDeleteComponent: (id: number) => void;
  onDuplicateComponent: (id: number) => void;
}) {
  if (!selectedComponent) {
    return (
      <div className="w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Properties</h2>
        </div>
        <div className="text-gray-400 text-center py-8">
          Select a component to edit properties
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Properties</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDuplicateComponent(selectedComponent.id)}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteComponent(selectedComponent.id)}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-white font-semibold mb-3">Basic</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Label</label>
              <input
                type="text"
                value={selectedComponent.label}
                onChange={(e) =>
                  onUpdateComponent(selectedComponent.id, { label: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-300 text-sm mb-1">X</label>
                <input
                  type="number"
                  value={selectedComponent.x}
                  onChange={(e) =>
                    onUpdateComponent(selectedComponent.id, { x: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Y</label>
                <input
                  type="number"
                  value={selectedComponent.y}
                  onChange={(e) =>
                    onUpdateComponent(selectedComponent.id, { y: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Appearance</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Opacity: {(selectedComponent.opacity || 1).toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedComponent.opacity || 1}
                onChange={(e) =>
                  onUpdateComponent(selectedComponent.id, { opacity: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Rotation: {selectedComponent.rotation || 0}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={selectedComponent.rotation || 0}
                onChange={(e) =>
                  onUpdateComponent(selectedComponent.id, { rotation: parseInt(e.target.value) })
                }
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-black font-semibold mb-3">Animation</h3>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Type</label>
            <select
              value={selectedComponent.animation?.type || 'none'}
              onChange={(e) => {
                const animationType = e.target.value as Component['animation']['type'];
                onUpdateComponent(selectedComponent.id, {
                  animation: {
                    type: animationType,
                    duration: selectedComponent.animation?.duration || 1000,
                    delay: selectedComponent.animation?.delay || 0,
                  }
                });
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 outline-none"
            >
              <option value="none">None</option>
              <option value="pulse">Pulse</option>
              <option value="bounce">Bounce</option>
              <option value="rotate">Rotate</option>
              <option value="float">Float</option>
              <option value="glow">Glow</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Visibility</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() =>
                onUpdateComponent(selectedComponent.id, { visible: !(selectedComponent.visible !== false) })
              }
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedComponent.visible !== false
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {selectedComponent.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {selectedComponent.visible !== false ? 'Visible' : 'Hidden'}
            </button>
            <button
              onClick={() =>
                onUpdateComponent(selectedComponent.id, { locked: !selectedComponent.locked })
              }
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedComponent.locked
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              <span>{selectedComponent.locked ? '🔒' : '🔓'}</span>
              {selectedComponent.locked ? 'Locked' : 'Unlocked'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Builder Component
export default function EnhancedAnimatedBuilder() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [canvasZoom, setCanvasZoom] = useState(1);

  const particles = useAdvancedParticles(100);

  const addComponent = useCallback((type: string) => {
    const newComponent: Component = {
      id: Date.now() + Math.random(),
      type,
      label: type === 'input' ? 'Enter text...' : `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200,
      width: type === 'button' ? 120 : type === 'input' ? 200 : undefined,
      height: type === 'button' ? 40 : type === 'input' ? 35 : undefined,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: components.length + 1,
      animation: {
        type: 'none',
        duration: 1000,
        delay: 0,
      },
    };
    
    setComponents(prev => [...prev, newComponent]);
    setSelectedId(newComponent.id);
  }, [components.length]);

  const updateComponentPosition = useCallback((id: number, x: number, y: number) => {
    setComponents(prev => prev.map(comp =>
      comp.id === id ? { ...comp, x, y } : comp
    ));
  }, []);

  const updateComponent = useCallback((id: number, updates: Partial<Component>) => {
    setComponents(prev => prev.map(comp =>
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  }, []);

  const deleteComponent = useCallback((id: number) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    setSelectedId(null);
  }, []);

  const duplicateComponent = useCallback((id: number) => {
    const component = components.find(c => c.id === id);
    if (component) {
      const duplicate = {
        ...component,
        id: Date.now() + Math.random(),
        x: component.x + 20,
        y: component.y + 20,
      };
      setComponents(prev => [...prev, duplicate]);
      setSelectedId(duplicate.id);
    }
  }, [components]);

  const selectedComponent = components.find(comp => comp.id === selectedId);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative overflow-hidden">
        <header className="relative z-50 flex items-center justify-between p-6 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-300"
            >
              ← Back to Home
            </button>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Enhanced UI Builder
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1">
              <button
                onClick={() => setCanvasZoom(Math.max(0.5, canvasZoom - 0.1))}
                className="text-white hover:text-cyan-400"
              >
                −
              </button>
              <span className="text-sm text-white w-12 text-center">
                {Math.round(canvasZoom * 100)}%
              </span>
              <button
                onClick={() => setCanvasZoom(Math.min(2, canvasZoom + 0.1))}
                className="text-white hover:text-cyan-400"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-colors ${
                showGrid ? 'bg-cyan-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>

            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                previewMode
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Play className="w-4 h-4" />
              {previewMode ? 'Exit Preview' : 'Preview'}
            </button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-88px)]">
          {!previewMode && (
            <EnhancedComponentPalette onAddComponent={addComponent} />
          )}

          <div className="flex-1 relative">
            <div
              ref={canvasRef}
              className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-purple-800/50"
              style={{
                backgroundImage: showGrid
                  ? 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)'
                  : 'none',
                backgroundSize: showGrid ? '20px 20px' : 'none',
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget && !previewMode) {
                  setSelectedId(null);
                }
              }}
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {particles.map((particle) => (
                  <div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                      left: `${particle.x * 100}%`,
                      top: `${particle.y * 100}%`,
                      width: particle.size,
                      height: particle.size,
                      backgroundColor: `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`,
                      boxShadow: `0 0 ${particle.size * 2}px hsla(${particle.hue}, 70%, 60%, ${particle.opacity * 0.5})`,
                    }}
                  />
                ))}
              </div>

              <div
                className="relative w-full h-full"
                style={{
                  transform: `scale(${canvasZoom})`,
                  transformOrigin: 'top left',
                }}
              >
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-lg rounded-lg px-4 py-2 text-white text-sm pointer-events-none">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Canvas ({components.length} components)</span>
                  </div>
                </div>

                {components.map((component) => (
                  <AdvancedDraggableComponent
                    key={component.id}
                    component={component}
                    onDrag={updateComponentPosition}
                    onSelect={(id) => !previewMode && setSelectedId(id)}
                    isSelected={selectedId === component.id && !previewMode}
                    canvasRef={canvasRef}
                  />
                ))}

                {components.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <h3 className="text-2xl font-bold text-white mb-2">Start Building</h3>
                      <p className="text-gray-400">
                        Add components from the palette to create your UI
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!previewMode && (
            <AdvancedPropertiesPanel
              selectedComponent={selectedComponent}
              onUpdateComponent={updateComponent}
              onDeleteComponent={deleteComponent}
              onDuplicateComponent={duplicateComponent}
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px currentColor; }
          50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }
        
        .custom-animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .custom-animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .component-item {
          font-weight: 600;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 245, 255, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 245, 255, 0.8);
        }
      `}</style>
    </>
  );
}
