/**
 * Typed access to public environment variables.
 *
 * NEXT_PUBLIC_* variables must be referenced as literal `process.env.NAME`
 * expressions so Next.js can inline them into the browser bundle.
 * Never add secrets here; anything in this file may reach the client.
 */
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** True when both Supabase variables are set to non-empty values. */
export const isSupabaseConfigured = Boolean(
  publicEnv.supabaseUrl && publicEnv.supabaseAnonKey,
);
