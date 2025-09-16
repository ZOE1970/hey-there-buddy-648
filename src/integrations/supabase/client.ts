import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hsorwervmmxhieefeala.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzb3J3ZXJ2bW14aGllZWZlYWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTIyMjcsImV4cCI6MjA3MzU4ODIyN30.PFLByeZKLfqOD3tkzjamMzstZwC-7AOf3SOh0vNOLcY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});