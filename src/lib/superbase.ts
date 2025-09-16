import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'vendor' | 'superadmin'  // Changed from 'admin' to 'superadmin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'vendor' | 'superadmin'  // Changed here too
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'vendor' | 'superadmin'  // And here
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}