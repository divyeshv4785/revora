// Server-Only Supabase Client for Privileged Storage Operations
// NEVER import this file in client-side components ('use client')
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fktqrojvcmzprfccjsfk.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

let serverClient: SupabaseClient | null = null;

export const getSupabaseServerClient = (): SupabaseClient => {
  if (!serverClient) {
    if (!process.env.SUPABASE_SECRET_KEY) {
      console.warn(
        '[REVORA Security Notice]: SUPABASE_SECRET_KEY is not defined in .env.local. Falling back to publishable key. Private bucket operations require the service_role secret key.'
      );
    }

    serverClient = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverClient;
};
