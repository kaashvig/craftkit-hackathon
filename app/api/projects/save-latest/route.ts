import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { name, content } = await req.json()
  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 })

  const supabase = getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: proj, error: pe } = await supabase
    .from("projects")
    .select("id")
    .eq("owner_id", user.id)
    .eq("name", name)
    .maybeSingle()
  if (pe) return NextResponse.json({ error: pe.message }, { status: 500 })

  let projectId = proj?.id
  if (!projectId) {
    const { data: created, error: ce } = await supabase
      .from("projects")
      .insert({ name, owner_id: user.id })
      .select()
      .single()
    if (ce) return NextResponse.json({ error: ce.message }, { status: 500 })
    projectId = created.id
  }

  const { error } = await supabase.from("project_versions").insert({ project_id: projectId, content })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
