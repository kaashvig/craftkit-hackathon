"use client"

import { COLORS } from "../design/tokens"
import { generatePageTSX } from "./codegen"
import type { Block } from "./types"

type Props = {
  name: string
  root: Block
  onSave: () => Promise<void> | void
  onPreview: () => void
}

export function Topbar({ name, root, onSave, onPreview }: Props) {
  const handleExport = () => {
    const code = generatePageTSX(name, root)
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${name || "generated"}-page.tsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <header
      className="flex items-center justify-between gap-3 border-b px-4 py-2"
      style={{ backgroundColor: COLORS.teal, borderColor: COLORS.offwhite }}
    >
      <div className="text-sm font-semibold" style={{ color: COLORS.offwhite }}>
        Studio
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPreview}
          className="rounded-md px-3 py-1.5 text-sm font-medium"
          style={{ backgroundColor: COLORS.navy, color: COLORS.offwhite, border: `1px solid ${COLORS.offwhite}` }}
        >
          Preview
        </button>
        <button
          onClick={() => onSave()}
          className="rounded-md px-3 py-1.5 text-sm font-medium"
          style={{ backgroundColor: COLORS.coral, color: COLORS.navy }}
        >
          Save
        </button>
        <button
          onClick={handleExport}
          className="rounded-md px-3 py-1.5 text-sm font-medium"
          style={{ backgroundColor: COLORS.lime, color: COLORS.navy }}
        >
          Export Code
        </button>
      </div>
    </header>
  )
}
