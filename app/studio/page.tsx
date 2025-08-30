import BuilderStudio from "@/components/builder/builder-studio"
import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase/server"

export default async function StudioPage() {
  // Attempt auth guard only if server envs are available; otherwise allow open preview
  const haveEnv = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY
  if (haveEnv) {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      redirect("/login")
    }
  }

  return <BuilderStudio />
}
