"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Icon } from "@/components/ui";
import { nextFromLocation } from "@/lib/safe-next";
import { supabase } from "@/lib/supabase";

/** Google sends people back here. The Supabase client reads the sign-in from the address, then we route them on. */
function returnedError(): string {
  try {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return query.get("error_description") || hash.get("error_description") || query.get("error") || hash.get("error") || "";
  } catch { return ""; }
}

const NEW_ACCOUNT_MINUTES = 10;

export default function AuthCallback() {
  const router = useRouter();
  const { status, user } = useAuth();
  const [problem, setProblem] = useState("");
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setProblem(returnedError());
    const timer = window.setTimeout(() => setTimedOut(true), 10000);
    return () => window.clearTimeout(timer);
  }, []);

  const userId = user?.id ?? null;
  const createdAt = user?.created_at ?? "";
  useEffect(() => {
    const client = supabase;
    if (status !== "signedIn" || !client || !userId) return;
    let live = true;
    const next = nextFromLocation("");
    client.from("profiles").select("skin_type").eq("id", userId).maybeSingle().then(({ data, error }) => {
      if (!live) return;
      const ageMinutes = createdAt ? (Date.now() - new Date(createdAt).getTime()) / 60000 : Infinity;
      const isNewGoogleAccount = !error && !data?.skin_type && ageMinutes < NEW_ACCOUNT_MINUTES;
      if (isNewGoogleAccount) router.replace(`/profile?welcome=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
      else router.replace(next || "/");
    });
    return () => { live = false; };
  }, [status, userId, createdAt, router]);

  const failed = Boolean(problem) || status === "signedOut" || (timedOut && status !== "signedIn");

  if (status === "demo") {
    return <section className="gate" aria-live="polite">
      <h1>Sign in is not switched on</h1>
      <p>Supabase is not connected to this copy of SkinSabi yet.</p>
      <Link className="button button--secondary" href="/">Go home</Link>
    </section>;
  }

  if (failed) {
    return <section className="gate" aria-live="polite">
      <Icon name="warning" size={32}/>
      <h1>We could not sign you in</h1>
      <p>{problem ? "Google did not finish signing you in. You can try again." : "That sign in did not complete. You can try again."}</p>
      <div className="gate__actions">
        <Link className="button" href="/login">Back to log in</Link>
        <Link className="button button--secondary" href="/">Go home</Link>
      </div>
    </section>;
  }

  return <section className="gate gate--loading" aria-live="polite" aria-busy="true">
    <h1>Signing you in…</h1>
    <p>One moment.</p>
  </section>;
}
