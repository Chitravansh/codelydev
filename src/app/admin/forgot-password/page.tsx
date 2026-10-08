import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Brand";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="card p-8">
        <div className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <p className="display text-lg font-semibold text-foreground">
              Forgot your password?
            </p>
            <p className="text-sm text-muted">
              We&apos;ll email you a link to set a new one.
            </p>
          </div>
        </div>
        <ForgotPasswordForm />
        <p className="mt-6 text-sm text-muted">
          Remembered it?{" "}
          <Link
            href="/admin/login"
            className="text-brand underline underline-offset-4"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
