// Supabase Client SDK for Browser Operations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fktqrojvcmzprfccjsfk.supabase.co';
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Supabase URL or Publishable Key is missing in environment variables.');
}

// Client for public operations (e.g., retrieving public URLs, client-side uploads with signed URLs)
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
