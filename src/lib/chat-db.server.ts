import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Server-only privileged client for the anonymous website chat log.
export function getChatDb() {
  return createClient<Database>(process.env["SUPABASE_URL"]!, process.env["SUPABASE_SERVICE_ROLE_KEY"]!, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}
