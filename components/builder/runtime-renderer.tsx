"use client"

import type React from "react"
import type { Block } from "./types"

// Render Block tree to live JSX (no eval). Keep styles minimal and rely on Tailwind classes in props.
export function RenderRuntime({ node }: { node: Block }) {
  return renderNode(node)
}

function renderNode(node: Block): React.ReactNode {
  const p = node.props || {}
  const children = (node.children || []).map((c) => <RenderRuntime key={c.id} node={c} />)

  switch (node.type) {
    case "section":
      return <section className={p.className || "py-12"}>{children}</section>
    case "container":
      return <div className={p.className || "mx-auto max-w-4xl px-4"}>{children}</div>
    case "heading":
      return <h2 className={p.className || "text-3xl font-semibold"}>{p.text || "Heading"}</h2>
    case "paragraph":
      return <p className={p.className || "text-base leading-relaxed text-pretty"}>{p.text || "Lorem ipsum"}</p>
    case "button":
      return (
        <button
          className={p.className || "inline-flex items-center rounded-md px-4 py-2 font-medium"}
          type={p.type || "button"}
        >
          {p.text || "Click me"}
        </button>
      )
    case "image":
      return (
        <img src={p.src || "/a-placeholder-image.png"} alt={p.alt || "Image"} className={p.className || "rounded-md"} />
      )
    case "input":
      return (
        <input
          type={p.type || "text"}
          placeholder={p.placeholder || "Type here"}
          className={p.className || "w-full rounded-md px-3 py-2"}
        />
      )
    case "form":
      return <form className={p.className || "grid gap-4"}>{children}</form>
    case "card":
      return <div className={p.className || "rounded-lg border p-6"}>{children}</div>
    case "list":
      return (
        <ul className={p.className || "list-disc pl-6 space-y-1"}>
          {(node.children || []).map((c) => (
            <li key={c.id}>{c.props?.text || "Item"}</li>
          ))}
        </ul>
      )
    default:
      return <div>{children}</div>
  }
}
