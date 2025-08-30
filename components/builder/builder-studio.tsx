"use client"

import { useEffect, useMemo, useState } from "react"
import { COLORS } from "../design/tokens"
import { Palette } from "./palette"
import { Canvas } from "./canvas"
import { PropertiesPanel } from "./properties-panel"
import type { Block, BuilderState } from "./types"
import { Topbar } from "./topbar"
import { RenderRuntime } from "./runtime-renderer" // import renderer

const initialRoot: Block = {
  id: "root",
  type: "section",
  props: { className: "py-12" },
  children: [
    {
      id: "c1",
      type: "container",
      props: {},
      children: [
        { id: "h1", type: "heading", props: { text: "Your App" } },
        { id: "p1", type: "paragraph", props: { text: "Drag blocks from the palette to the canvas." } },
      ],
    },
  ],
}

export default function BuilderStudio() {
  const [state, setState] = useState<BuilderState>(() => {
    const name = typeof window !== "undefined" ? localStorage.getItem("app_name") || "MyApp" : "MyApp"
    const saved = typeof window !== "undefined" ? localStorage.getItem("builder_state") : null
    return saved ? (JSON.parse(saved) as BuilderState) : { name, root: initialRoot }
  })
  const [showPreview, setShowPreview] = useState(false) // preview state

  useEffect(() => {
    localStorage.setItem("builder_state", JSON.stringify(state))
  }, [state])

  const selected = useMemo(() => findNode(state.root, state.selectedId), [state])

  function onSelect(id?: string) {
    setState((s) => ({ ...s, selectedId: id }))
  }

  function onInsert(parentId: string, block: Block) {
    setState((s) => ({ ...s, root: insertNode(s.root, parentId, block) }))
  }

  function onPropChange(next: Partial<Block["props"]>) {
    if (!state.selectedId) return
    setState((s) => ({ ...s, root: updateNodeProps(s.root, s.selectedId!, next) }))
  }

  async function onSave() {
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: state.name }),
      })
      await fetch("/api/projects/save-latest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: state.name, content: state.root }),
      })
      alert("Saved!")
    } catch (e: any) {
      alert("Save failed")
    }
  }

  function onPreview() {
    setShowPreview(true)
  }

  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col" style={{ backgroundColor: COLORS.navy }}>
      <Topbar name={state.name} root={state.root} onSave={onSave} onPreview={onPreview} />
      <div className="flex flex-1">
        <Palette />
        <Canvas root={state.root} selectedId={state.selectedId} onSelect={onSelect} onInsert={onInsert} />
        <PropertiesPanel selected={selected} onChange={onPropChange} />
      </div>

      {showPreview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(10,25,49,0.75)" }}
          onClick={() => setShowPreview(false)}
        >
          <div
            className="max-h-[90dvh] w-full max-w-3xl overflow-auto rounded-lg border p-6"
            style={{ backgroundColor: COLORS.offwhite, color: COLORS.navy, borderColor: COLORS.teal }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview — {state.name}</h3>
              <button
                className="rounded-md px-3 py-1.5 text-sm font-medium"
                style={{ backgroundColor: COLORS.coral, color: COLORS.navy }}
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
            </div>
            <div className="border-t pt-4" style={{ borderColor: COLORS.teal }}>
              <RenderRuntime node={state.root} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function findNode(node: Block, id?: string): Block | undefined {
  if (!id) return undefined
  if (node.id === id) return node
  for (const c of node.children || []) {
    const f = findNode(c, id)
    if (f) return f
  }
  return undefined
}

function insertNode(node: Block, parentId: string, block: Block): Block {
  if (node.id === parentId) {
    return { ...node, children: [...(node.children || []), block] }
  }
  return { ...node, children: (node.children || []).map((c) => insertNode(c, parentId, block)) }
}

function updateNodeProps(node: Block, id: string, next: Partial<Block["props"]>): Block {
  if (node.id === id) {
    return { ...node, props: { ...(node.props || {}), ...next } }
  }
  return { ...node, children: (node.children || []).map((c) => updateNodeProps(c, id, next)) }
}
