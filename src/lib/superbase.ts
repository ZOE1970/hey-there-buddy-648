import { createClient } from '@supabase/supabase-js'

// Use the same client configuration as the integration
const SUPABASE_URL = 'https://hsorwervmmxhieefeala.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzb3J3ZXJ2bW14aGllZWZlYWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTIyMjcsImV4cCI6MjA3MzU4ODIyN30.PFLByeZKLfqOD3tkzjamMzstZwC-7AOf3SOh0vNOLcY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})

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