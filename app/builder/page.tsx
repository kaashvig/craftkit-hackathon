"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error
import { getSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BuilderApp from "@/components/builder/builder-app"

// Color palette: EXACTLY 5 colors (with optional alpha usage only)
const COLORS = {
  navy: "#0A1931",
  teal: "#1B5E68",
  coral: "#FF6B6B",
  lime: "#B9FF14",
  offwhite: "#E5F2E9",
} as const

type PaletteType = "heading" | "text" | "button" | "input" | "card" | "divider"

type NodeBase = {
  id: string
  type: PaletteType
  props?: Record<string, any>
}

type BuilderState = {
  nodes: NodeBase[]
  selectedId?: string | null
  preview?: boolean
}

const DEFAULTS: Record<PaletteType, Partial<NodeBase["props"]>> = {
  heading: { text: "Section Heading", level: 2, align: "left", color: "offwhite" },
  text: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", align: "left", color: "offwhite" },
  button: { label: "Click Me", variant: "primary", align: "left" },
  input: { placeholder: "Enter text...", width: "full" },
  card: { title: "Card Title", body: "Card copy goes here.", tone: "teal" },
  divider: { thickness: "thin", color: "teal" },
}

const LS_KEYS = {
  state: "craftkit.builder.state",
  appName: "craftkit.appName",
}

function uid(prefix = "n") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export default async function BuilderPage() {
  const supabase = getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <BuilderApp />
}

function Topbar({
  appName,
  preview,
  onTogglePreview,
  onSave,
  onClear,
}: {
  appName: string
  preview: boolean
  onTogglePreview: () => void
  onSave: () => void
  onClear: () => void
}) {
  return (
    <header className="w-full border-b" style={{ borderColor: COLORS.teal, backgroundColor: COLORS.navy }}>
      <div className="mx-auto max-w-6xl px-4 md:px-6 flex items-center justify-between h-14">
        <h1 className="text-pretty font-semibold" style={{ color: COLORS.offwhite }}>
          {appName}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePreview}
            className="px-3 py-1.5 rounded-md text-sm"
            style={{
              backgroundColor: preview ? COLORS.teal : "transparent",
              color: COLORS.offwhite,
              border: `1px solid ${COLORS.teal}`,
            }}
          >
            {preview ? "Exit Preview" : "Preview"}
          </button>
          <button
            onClick={onSave}
            className="px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ backgroundColor: COLORS.coral, color: COLORS.navy, boxShadow: `0 0 0 2px ${COLORS.lime}` }}
          >
            Save
          </button>
          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-md text-sm"
            style={{ backgroundColor: "transparent", color: COLORS.offwhite, border: `1px solid ${COLORS.teal}` }}
          >
            Clear
          </button>
        </div>
      </div>
    </header>
  )
}

function Palette() {
  const items: { type: PaletteType; label: string }[] = [
    { type: "heading", label: "Heading" },
    { type: "text", label: "Text" },
    { type: "button", label: "Button" },
    { type: "input", label: "Input" },
    { type: "card", label: "Card" },
    { type: "divider", label: "Divider" },
  ]
  return (
    <aside
      className="rounded-lg p-3 md:p-4 border"
      style={{ backgroundColor: "rgba(10,25,49,0.35)", borderColor: COLORS.teal }}
    >
      <h2 className="text-sm font-medium mb-3" style={{ color: COLORS.offwhite }}>
        Components
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
        {items.map((it) => (
          <div
            key={it.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", it.type)
            }}
            className="cursor-grab active:cursor-grabbing select-none rounded-md px-3 py-2 text-sm border"
            style={{ backgroundColor: COLORS.teal, color: COLORS.offwhite, borderColor: "transparent" }}
          >
            {it.label}
          </div>
        ))}
      </div>
    </aside>
  )
}

function Canvas({
  nodes,
  preview,
  onDropType,
  onSelect,
  onUpdate,
  onRemove,
  onReorder,
}: {
  nodes: NodeBase[]
  preview: boolean
  onDropType: (type: PaletteType) => void
  onSelect: (id: string) => void
  onUpdate: (id: string, nextProps: Record<string, any>) => void
  onRemove: (id: string) => void
  onReorder: (fromIdx: number, toIdx: number) => void
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const type = e.dataTransfer.getData("text/plain") as PaletteType
        if (type) onDropType(type)
      }}
      className="rounded-lg min-h-[60dvh] p-4 md:p-6 border"
      style={{
        backgroundColor: "rgba(10,25,49,0.4)", // navy with alpha
        borderColor: COLORS.teal,
      }}
    >
      {nodes.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center text-sm" style={{ color: COLORS.offwhite }}>
          Drag components here from the palette
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {nodes.map((n, idx) => (
            <li
              key={n.id}
              className={cn("rounded-md p-3 group border")}
              style={{
                backgroundColor: "transparent",
                borderColor: COLORS.teal,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(n.id)}
                  className="flex-1 outline-none"
                  style={{ color: COLORS.offwhite }}
                >
                  <RenderNode node={n} preview={preview} onUpdate={(p) => onUpdate(n.id, p)} />
                </div>
                {!preview && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: COLORS.coral,
                        color: COLORS.navy,
                        boxShadow: `0 0 0 2px ${COLORS.lime}`,
                      }}
                      onClick={() => onRemove(n.id)}
                    >
                      Remove
                    </button>
                    <div className="flex flex-col">
                      <button
                        className="px-2 py-1 rounded text-xs mb-1 border"
                        style={{ backgroundColor: "transparent", color: COLORS.offwhite, borderColor: COLORS.teal }}
                        onClick={() => idx > 0 && onReorder(idx, idx - 1)}
                      >
                        Up
                      </button>
                      <button
                        className="px-2 py-1 rounded text-xs border"
                        style={{ backgroundColor: "transparent", color: COLORS.offwhite, borderColor: COLORS.teal }}
                        onClick={() => idx < nodes.length - 1 && onReorder(idx, idx + 1)}
                      >
                        Down
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function RenderNode({
  node,
  preview,
  onUpdate,
}: {
  node: NodeBase
  preview: boolean
  onUpdate: (next: Record<string, any>) => void
}) {
  const p = node.props || {}
  switch (node.type) {
    case "heading": {
      const level = Math.min(Math.max(Number(p.level || 2), 1), 4)
      const Tag = `h${level}` as unknown as keyof JSX.IntrinsicElements
      return (
        <Tag className={cn("font-semibold text-pretty", p.align === "center" && "text-center")}>
          <span style={{ color: COLORS[(p.color as keyof typeof COLORS) || "offwhite"] }}>{p.text}</span>
        </Tag>
      )
    }
    case "text":
      return (
        <p
          className={cn("leading-relaxed", p.align === "center" && "text-center")}
          style={{ color: COLORS[(p.color as keyof typeof COLORS) || "offwhite"] }}
        >
          {p.text}
        </p>
      )
    case "button":
      return (
        <button
          className={cn("px-4 py-2 rounded-md font-medium", p.align === "center" && "mx-auto block")}
          disabled={preview}
          style={{
            backgroundColor: p.variant === "primary" ? COLORS.coral : COLORS.teal,
            color: p.variant === "primary" ? COLORS.navy : COLORS.offwhite,
            boxShadow: p.variant === "primary" ? `0 0 0 2px ${COLORS.lime}` : "none",
            cursor: preview ? "not-allowed" : "pointer",
          }}
        >
          {p.label}
        </button>
      )
    case "input":
      return (
        <input
          placeholder={p.placeholder}
          disabled={preview}
          className={cn(
            "rounded-md px-3 py-2 bg-transparent outline-none w-full border",
            p.width === "auto" && "w-auto",
          )}
          style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
        />
      )
    case "card":
      return (
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: p.tone === "teal" ? "rgba(27,94,104,0.18)" : "rgba(255,107,107,0.18)",
            borderColor: COLORS.teal,
          }}
        >
          <h3 className="font-semibold mb-1" style={{ color: COLORS.offwhite }}>
            {p.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.offwhite }}>
            {p.body}
          </p>
        </div>
      )
    case "divider":
      return (
        <div
          style={{
            height: p.thickness === "thick" ? 4 : 2,
            backgroundColor: COLORS[(p.color as keyof typeof COLORS) || "teal"],
            opacity: 0.85,
          }}
          aria-hidden
        />
      )
    default:
      return null
  }
}

function PropertiesPanel({
  node,
  onChange,
}: {
  node: NodeBase | null
  onChange: (next: Record<string, any>) => void
}) {
  return (
    <aside
      className="rounded-lg p-4 border"
      style={{ backgroundColor: "rgba(10,25,49,0.35)", borderColor: COLORS.teal }}
    >
      <h2 className="text-sm font-medium mb-3" style={{ color: COLORS.offwhite }}>
        Properties
      </h2>
      {!node ? (
        <p className="text-sm" style={{ color: COLORS.offwhite }}>
          Select an element on the canvas to edit its properties.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <Badge>{node.type}</Badge>

          {node.type === "heading" && (
            <>
              <Field label="Text">
                <input
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.text || ""}
                  onChange={(e) => onChange({ text: e.target.value })}
                />
              </Field>
              <Field label="Level">
                <select
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.level || 2}
                  onChange={(e) => onChange({ level: Number(e.target.value) })}
                >
                  {[1, 2, 3, 4].map((l) => (
                    <option key={l} value={l} style={{ color: "black" }}>{`H${l}`}</option>
                  ))}
                </select>
              </Field>
              <AlignPicker value={node.props?.align || "left"} onChange={(v) => onChange({ align: v })} />
              <ColorPicker
                label="Color"
                value={(node.props?.color as keyof typeof COLORS) || "offwhite"}
                onChange={(v) => onChange({ color: v })}
              />
            </>
          )}

          {node.type === "text" && (
            <>
              <Field label="Text">
                <textarea
                  rows={4}
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm leading-relaxed"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.text || ""}
                  onChange={(e) => onChange({ text: e.target.value })}
                />
              </Field>
              <AlignPicker value={node.props?.align || "left"} onChange={(v) => onChange({ align: v })} />
              <ColorPicker
                label="Color"
                value={(node.props?.color as keyof typeof COLORS) || "offwhite"}
                onChange={(v) => onChange({ color: v })}
              />
            </>
          )}

          {node.type === "button" && (
            <>
              <Field label="Label">
                <input
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.label || ""}
                  onChange={(e) => onChange({ label: e.target.value })}
                />
              </Field>
              <Field label="Variant">
                <select
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.variant || "primary"}
                  onChange={(e) => onChange({ variant: e.target.value })}
                >
                  <option value="primary" style={{ color: "black" }}>
                    Primary
                  </option>
                  <option value="secondary" style={{ color: "black" }}>
                    Secondary
                  </option>
                </select>
              </Field>
              <AlignPicker value={node.props?.align || "left"} onChange={(v) => onChange({ align: v })} />
            </>
          )}

          {node.type === "input" && (
            <>
              <Field label="Placeholder">
                <input
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.placeholder || ""}
                  onChange={(e) => onChange({ placeholder: e.target.value })}
                />
              </Field>
              <Field label="Width">
                <select
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.width || "full"}
                  onChange={(e) => onChange({ width: e.target.value })}
                >
                  <option value="full" style={{ color: "black" }}>
                    Full
                  </option>
                  <option value="auto" style={{ color: "black" }}>
                    Auto
                  </option>
                </select>
              </Field>
            </>
          )}

          {node.type === "card" && (
            <>
              <Field label="Title">
                <input
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.title || ""}
                  onChange={(e) => onChange({ title: e.target.value })}
                />
              </Field>
              <Field label="Body">
                <textarea
                  rows={3}
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm leading-relaxed"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.body || ""}
                  onChange={(e) => onChange({ body: e.target.value })}
                />
              </Field>
              <Field label="Tone">
                <select
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.tone || "teal"}
                  onChange={(e) => onChange({ tone: e.target.value })}
                >
                  <option value="teal" style={{ color: "black" }}>
                    Teal
                  </option>
                  <option value="coral" style={{ color: "black" }}>
                    Coral
                  </option>
                </select>
              </Field>
            </>
          )}

          {node.type === "divider" && (
            <>
              <Field label="Thickness">
                <select
                  className="w-full bg-transparent border rounded px-2 py-1 text-sm"
                  style={{ borderColor: COLORS.teal, color: COLORS.offwhite }}
                  value={node.props?.thickness || "thin"}
                  onChange={(e) => onChange({ thickness: e.target.value })}
                >
                  <option value="thin" style={{ color: "black" }}>
                    Thin
                  </option>
                  <option value="thick" style={{ color: "black" }}>
                    Thick
                  </option>
                </select>
              </Field>
              <ColorPicker
                label="Color"
                value={(node.props?.color as keyof typeof COLORS) || "teal"}
                onChange={(v) => onChange({ color: v })}
              />
            </>
          )}
        </div>
      )}
    </aside>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs" style={{ color: COLORS.offwhite }}>
        {label}
      </span>
      {children}
    </label>
  )
}

function AlignPicker({
  value,
  onChange,
}: {
  value: "left" | "center"
  onChange: (v: "left" | "center") => void
}) {
  return (
    <Field label="Alignment">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange("left")}
          className="px-2 py-1 rounded text-xs border"
          style={{
            backgroundColor: value === "left" ? COLORS.teal : "transparent",
            color: COLORS.offwhite,
            borderColor: COLORS.teal,
          }}
        >
          Left
        </button>
        <button
          onClick={() => onChange("center")}
          className="px-2 py-1 rounded text-xs border"
          style={{
            backgroundColor: value === "center" ? COLORS.teal : "transparent",
            color: COLORS.offwhite,
            borderColor: COLORS.teal,
          }}
        >
          Center
        </button>
      </div>
    </Field>
  )
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: keyof typeof COLORS
  onChange: (v: keyof typeof COLORS) => void
}) {
  const entries = Object.entries(COLORS) as [keyof typeof COLORS, string][]
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        {entries.map(([k, hex]) => {
          const selected = value === k
          return (
            <button
              key={k}
              onClick={() => onChange(k)}
              aria-label={`${label}: ${k}`}
              className="h-6 w-6 rounded"
              style={{
                backgroundColor: hex,
                border: `2px solid ${selected ? COLORS.lime : "transparent"}`,
              }}
            />
          )
        })}
      </div>
      <span className="sr-only">{String(value)}</span>
    </Field>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[10px] uppercase tracking-wide px-2 py-1 rounded self-start"
      style={{ backgroundColor: COLORS.teal, color: COLORS.offwhite }}
    >
      {children}
    </span>
  )
}
