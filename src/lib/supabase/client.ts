import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "./env";
import { createMockClient } from "./mock";

export function createClient() {
  if (!isSupabaseConfigured()) {
    return createMockClient(false) as unknown as ReturnType<typeof createBrowserClient>;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
