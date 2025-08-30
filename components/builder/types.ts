export type BlockType =
  | "section"
  | "container"
  | "heading"
  | "paragraph"
  | "button"
  | "image"
  | "input"
  | "form"
  | "card"
  | "list"

export type Block = {
  id: string
  type: BlockType
  props?: Record<string, any>
  children?: Block[]
}

export type BuilderState = {
  name: string
  root: Block
  selectedId?: string
}
