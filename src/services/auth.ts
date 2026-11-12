import { isSupabaseConfigured, publicEnv } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  SELF_SERVICE_ROLES,
  USER_ROLES,
  type SelfServiceRole,
  type ServiceResult,
  type UserRole,
} from "@/types";

import { NOT_CONFIGURED_MESSAGE, fail, ok } from "./result";

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput extends SignInInput {
  fullName: string;
  role: SelfServiceRole;
}

export function isUserRole(value: unknown): value is UserRole {
  return (USER_ROLES as readonly unknown[]).includes(value);
}

export function isSelfServiceRole(value: unknown): value is SelfServiceRole {
  return (SELF_SERVICE_ROLES as readonly unknown[]).includes(value);
}

/**
 * Sign in with email + password (browser only).
 *
 * The returned role comes from `user_metadata` and is used ONLY to choose a
 * landing page. `user_metadata` is editable by the user, so never use it for
 * authorization. Enforce access with Row Level Security and a role stored in
 * `app_metadata` or a protected table.
 */
export async function signInWithPassword({
  email,
  password,
}: SignInInput): Promise<ServiceResult<{ role: UserRole }>> {
  if (!isSupabaseConfigured) return fail("not_configured", NOT_CONFIGURED_MESSAGE);

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return fail("unauthorized", error.message);

  const metaRole: unknown = data.user.user_metadata?.role;
  return ok({ role: isUserRole(metaRole) ? metaRole : "student" });
}

/** Create an account (browser only). Admins are never self-registered. */
export async function signUpWithPassword({
  email,
  password,
  fullName,
  role,
}: SignUpInput): Promise<ServiceResult<{ needsEmailConfirmation: boolean }>> {
  if (!isSupabaseConfigured) return fail("not_configured", NOT_CONFIGURED_MESSAGE);

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${publicEnv.siteUrl}/login`,
    },
  });
  if (error) return fail("validation", error.message);

  return ok({ needsEmailConfirmation: data.session === null });
}
