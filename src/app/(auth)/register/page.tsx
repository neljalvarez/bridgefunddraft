import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";
import { isSelfServiceRole } from "@/services/auth";

export const metadata: Metadata = { title: "Create account" };

/**
 * `searchParams` is runtime data, so with Cache Components it is read inside
 * a Suspense boundary. The fallback renders the same form with the default role.
 */
async function RegisterFormWithRole({
  searchParams,
}: {
  searchParams: PageProps<"/register">["searchParams"];
}) {
  const { role } = await searchParams;
  const requested = Array.isArray(role) ? role[0] : role;
  return (
    <RegisterForm
      defaultRole={isSelfServiceRole(requested) ? requested : "student"}
    />
  );
}

export default function RegisterPage(props: PageProps<"/register">) {
  return (
    <AuthCard
      title="Create your account"
      description="Join BridgeFund as a student or an organization."
    >
      <Suspense fallback={<RegisterForm defaultRole="student" />}>
        <RegisterFormWithRole searchParams={props.searchParams} />
      </Suspense>
    </AuthCard>
  );
}
