import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase senza cookie/sessione, per letture pubbliche (RLS anon)
 * da pagine statiche/ISR: non usa `cookies()`, quindi non forza il rendering
 * dinamico e funziona in fase di prerender.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
