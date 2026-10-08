import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { LogoMark } from "@/components/Brand";
import { SetNewPasswordForm } from "./SetNewPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ code?: string; error?: string; error_description?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient(await cookies());

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let failure: string | null = params.error_description ?? params.error ?? null;

  if (!session && !failure) {
    if (params.code) {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(params.code);
      if (exchangeError) {
        failure =
          "This reset link is invalid or has expired. Request a new one.";
      }
    } else {
      failure = "This page can only be reached from a reset link in your email.";
    }
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="card p-8">
        <div className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <p className="display text-lg font-semibold text-foreground">
              Set a new password
            </p>
            <p className="text-sm text-muted">
              Choose a new password for the admin account.
            </p>
          </div>
        </div>

        {failure ? (
          <div className="mt-7">
            <p role="alert" className="text-sm text-red-500">
              {failure}
            </p>
            <Link
              href="/admin/forgot-password"
              className="btn-primary mt-5 inline-flex"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <SetNewPasswordForm />
        )}
      </div>
    </div>
  );
}
