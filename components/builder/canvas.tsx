"use client"

import type React from "react"
import { useCallback } from "react"
import { COLORS } from "../design/tokens"
import type { Block } from "./types"

type Props = {
  root: Block
  selectedId?: string
  onSelect: (id: string) => void
  onInsert: (parentId: string, block: Block, index?: number) => void
}

export function Canvas({ root, selectedId, onSelect, onInsert }: Props) {
  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: COLORS.navy }}>
      <div
        className="mx-auto my-6 min-h-[60vh] max-w-3xl rounded-lg border p-6"
        style={{ backgroundColor: COLORS.offwhite, color: COLORS.navy, borderColor: COLORS.teal }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const data = e.dataTransfer.getData("application/json")
          if (!data) return
          const payload = JSON.parse(data)
          const id = crypto.randomUUID()
          onInsert(root.id, { id, type: payload.type, props: payload.sample?.props || {}, children: [] })
        }}
      >
        <Tree node={root} selectedId={selectedId} onSelect={onSelect} />
      </div>
    </div>
  )
}

function Tree({ node, selectedId, onSelect }: { node: Block; selectedId?: string; onSelect: (id: string) => void }) {
  const isRoot = node.id === "root"
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(node.id)
    },
    [node.id, onSelect],
  )

  const Wrapper = "div"
  const border = selectedId === node.id ? `2px solid ${COLORS.coral}` : `1px dashed ${COLORS.teal}`

  return (
    <Wrapper
      onClick={handleClick as any}
      style={{
        border: isRoot ? "none" : border,
        borderRadius: 8,
        padding: isRoot ? 0 : 8,
        marginBottom: isRoot ? 0 : 8,
      }}
    >
      {!isRoot && (
        <div className="mb-2 text-xs font-medium" style={{ color: COLORS.teal }}>
          {node.type}
        </div>
      )}
      {(node.children || []).map((c) => (
        <Tree key={c.id} node={c} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </Wrapper>
  )
}
