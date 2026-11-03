"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/components/auth-provider";

/**
 * A convenience gate, not security. It only decides what the page shows.
 * The real protection is Row Level Security in Supabase, which limits every person to their own rows.
 */
export function RequireLogin({ what, children }: { what: string; children: ReactNode }) {
  const { status } = useAuth();
  const pathname = usePathname();

  if (status === "loading") {
    return <div className="gate gate--loading" role="status"><p>Checking your account…</p></div>;
  }

  if (status === "signedOut") {
    const next = encodeURIComponent(pathname || "/");
    return <section className="gate card" aria-labelledby="gate-title">
      <h1 id="gate-title">Log in to {what}</h1>
      <p>It only takes a minute, and it keeps your routine and patch tests saved to you.</p>
      <div className="gate__actions">
        <Link className="button button--cta" href={`/login?next=${next}`}>Log in</Link>
        <Link className="button button--secondary" href={`/signup?next=${next}`}>Create an account</Link>
      </div>
    </section>;
  }

  return <>{children}</>;
}

/** Wraps a link target that depends on being signed in: signed out goes to Sign up, otherwise to the destination. */
export function useSignedInHref(destination: string) {
  const { status } = useAuth();
  return status === "signedOut" ? "/signup" : destination;
}
