"use client"

import { COLORS } from "../design/tokens"
import type { Block, BlockType } from "./types"

const ITEMS: { type: BlockType; label: string; sample?: Partial<Block> }[] = [
  { type: "section", label: "Section" },
  { type: "container", label: "Container" },
  { type: "heading", label: "Heading", sample: { props: { text: "Welcome" } } },
  { type: "paragraph", label: "Paragraph", sample: { props: { text: "Start building visually." } } },
  {
    type: "button",
    label: "Button",
    sample: {
      props: { text: "Get Started", className: "bg-[#FF6B6B] text-[#0A1931] px-4 py-2 rounded-md hover:opacity-90" },
    },
  },
  { type: "image", label: "Image" },
  { type: "input", label: "Input" },
  { type: "form", label: "Form" },
  { type: "card", label: "Card" },
  { type: "list", label: "List", sample: { children: [{ id: "li1", type: "paragraph", props: { text: "Item" } }] } },
]

export function Palette() {
  return (
    <aside
      className="h-full w-64 shrink-0 border-r"
      style={{ backgroundColor: COLORS.teal, borderColor: COLORS.offwhite }}
    >
      <div className="p-3 text-sm font-semibold" style={{ color: COLORS.offwhite }}>
        Palette
      </div>
      <div className="grid gap-2 p-3">
        {ITEMS.map((it) => (
          <button
            key={it.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/json", JSON.stringify({ type: it.type, sample: it.sample || {} }))
            }}
            className="w-full rounded-md px-3 py-2 text-left text-sm"
            style={{ backgroundColor: COLORS.navy, color: COLORS.offwhite, border: `1px solid ${COLORS.offwhite}` }}
          >
            {it.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
