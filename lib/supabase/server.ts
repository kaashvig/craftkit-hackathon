// lib/supabase/mock-server.ts
export function getSupabaseServer() {
  // Mock Supabase for hackathon demo
  return {
    auth: {
      getUser: async () => ({
        data: { 
          user: { 
            id: 'demo-user',
            email: 'demo@craftkit.ai',
            user_metadata: { name: 'Demo User' }
          } 
        },
        error: null
      })
    }
  }
}
