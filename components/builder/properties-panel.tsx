"use client"

import { useMemo } from "react"
import { COLORS } from "../design/tokens"
import type { Block } from "./types"

type Props = {
  selected?: Block
  onChange: (next: Partial<Block["props"]>) => void
}

export function PropertiesPanel({ selected, onChange }: Props) {
  const props = selected?.props || {}
  const fields = useMemo(() => {
    switch (selected?.type) {
      case "heading":
      case "paragraph":
      case "button":
        return ["text", "className"]
      case "image":
        return ["src", "alt", "className"]
      case "input":
        return ["type", "placeholder", "className"]
      case "section":
      case "container":
      case "form":
      case "card":
      case "list":
        return ["className"]
      default:
        return ["className"]
    }
  }, [selected?.type])

  return (
    <aside
      className="h-full w-72 shrink-0 border-l"
      style={{ backgroundColor: COLORS.teal, borderColor: COLORS.offwhite }}
    >
      <div className="p-3 text-sm font-semibold" style={{ color: COLORS.offwhite }}>
        Properties {selected ? `— ${selected.type}` : ""}
      </div>
      {!selected ? (
        <div className="p-3 text-sm" style={{ color: COLORS.offwhite }}>
          Select a block to edit.
        </div>
      ) : (
        <form className="grid gap-3 p-3">
          {fields.map((key) => (
            <label key={key} className="grid gap-1 text-xs" style={{ color: COLORS.offwhite }}>
              <span className="opacity-80">{key}</span>
              <input
                className="rounded-md px-2 py-1 text-sm"
                style={{ backgroundColor: COLORS.navy, color: COLORS.offwhite, border: `1px solid ${COLORS.offwhite}` }}
                value={(props as any)[key] || ""}
                onChange={(e) => onChange({ [key]: e.target.value })}
              />
            </label>
          ))}
        </form>
      )}
    </aside>
  )
}
