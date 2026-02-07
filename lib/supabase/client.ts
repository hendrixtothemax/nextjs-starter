import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}