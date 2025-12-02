import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Browser client (uses public keys)
export const createBrowserSupabase = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// Server client (uses service role key - only for server-side use)
export const createServerSupabase = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase server environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Singleton browser client for client-side usage
let browserClient: SupabaseClient | null = null;

export const getBrowserSupabase = (): SupabaseClient => {
  if (!browserClient) {
    browserClient = createBrowserSupabase();
  }
  return browserClient;
};
