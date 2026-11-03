"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AmbientSprites } from "@/components/ambient-sprites";
import { useAuth } from "@/components/auth-provider";
import { Wordmark } from "@/components/site-shell";
import { Button, Input } from "@/components/ui";
import { nextFromLocation } from "@/lib/safe-next";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const { status } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [signupHref, setSignupHref] = useState("/signup");

  // Keep ?next= when moving between Log in and Sign up.
  useEffect(() => {
    const next = nextFromLocation("");
    if (next) setSignupHref(`/signup?next=${encodeURIComponent(next)}`);
  }, []);

  // Already signed in: go where they were headed.
  useEffect(() => {
    if (status === "signedIn") router.replace(nextFromLocation("/"));
  }, [status, router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setMessage("Add Supabase URL and anon key to enable sign in."); return; }
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setBusy(false); setMessage(error.message); return; }
    setMessage("You are signed in. Welcome back!");
    router.replace(nextFromLocation("/"));
  }

  return <div className="auth-page ambient-host">
    <AmbientSprites/>
    <section className="auth-card card stack" aria-labelledby="login-title">
      <Wordmark/>
      <div>
        <h1 id="login-title">Log in</h1>
        <p className="auth-card__lede">Welcome back. Pick up where you left off.</p>
      </div>
      <form className="stack" onSubmit={submit}>
        <Input label="Email" required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)}/>
        <Input label="Password" required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)}/>
        <Button type="submit" size="large" disabled={busy}>{busy ? "Logging in…" : "Log in"}</Button>
        {message && <p role="status">{message}</p>}
      </form>
      <p className="auth-switch">New to SkinSabi? <Link href={signupHref}>Create an account</Link></p>
    </section>
  </div>;
}
