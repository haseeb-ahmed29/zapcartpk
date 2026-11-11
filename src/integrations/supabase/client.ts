import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Security: Validate Supabase URL scheme to prevent CWE-319 (Cleartext Transmission of Sensitive Information)
// Enforces HTTPS for remote connections, permitting HTTP only for local development hostnames.
export function validateSupabaseUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const isLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (parsed.protocol !== "https:" && (!isLocalhost || parsed.protocol !== "http:")) {
      throw new Error(`Insecure Supabase URL protocol: '${parsed.protocol}'. Must use 'https:'.`);
    }
    return rawUrl;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Insecure Supabase URL")) {
      throw err;
    }
    throw new Error(`Invalid Supabase URL format: '${rawUrl}'.`);
  }
}

// Fail fast with clear error if required environment variables are missing
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be defined."
  );
}

validateSupabaseUrl(SUPABASE_URL);

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
