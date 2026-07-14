import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "./env";
import { createMockClient } from "./mock";

/** Client Supabase lato browser (componenti client). Usa la anon key. */
export function createClient() {
  if (!isSupabaseConfigured()) {
    return createMockClient(false) as unknown as ReturnType<typeof createBrowserClient>;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
