import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl || supabaseUrl === '') {
  throw new Error('Supabase URL is required')
}

if (!supabaseAnonKey || supabaseAnonKey === '') {
  throw new Error('Supabase Anon Key is required')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
