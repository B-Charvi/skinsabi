"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AmbientSprites } from "@/components/ambient-sprites";
import { useAuth } from "@/components/auth-provider";
import { GoogleButton } from "@/components/google-button";
import { Illustration } from "@/components/illustration";
import { Wordmark } from "@/components/site-shell";
import { Icon, Input, Select } from "@/components/ui";
import { NIGERIAN_STATES } from "@/lib/nigeria-states";
import { nextFromLocation } from "@/lib/safe-next";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const router = useRouter();
  const { status } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skin, setSkin] = useState("I Don't Know");
  const [concern, setConcern] = useState("Both");
  const [budget, setBudget] = useState("Under ₦15k");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loginHref, setLoginHref] = useState("/login");

  // Keep ?next= when moving between Sign up and Log in.
  useEffect(() => {
    const next = nextFromLocation("");
    if (next) setLoginHref(`/login?next=${encodeURIComponent(next)}`);
  }, []);

  // Already signed in: nothing to do here.
  useEffect(() => {
    if (status === "signedIn") router.replace(nextFromLocation("/"));
  }, [status, router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!agree) { setMessage("Please confirm you understand the safety note."); return; }
    if (!supabase) { setMessage("Add your Supabase URL and anon key to enable account creation. You can still explore the demo."); return; }
    setBusy(true);
    setMessage("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // The database trigger copies these keys into the profiles table, even when email confirmation is on.
      options: { data: { full_name: name, skin_type: skin, main_concern: concern, budget, state, city: city.trim() } },
    });
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    if (data.session) { router.replace(nextFromLocation("/routine")); return; }
    setMessage(data.user ? "Welcome! Check your email to confirm your account. Your skin knows best." : "Account request sent.");
  }

  return <div className="ambient-host">
    <AmbientSprites/>
    <div className="card signup-welcome">
      <div className="signup-welcome__copy">
        <div className="signup-welcome__wordmark"><Wordmark size="panel"/></div>
        <h1 className="signup-welcome__title">Your skin sabi pass.</h1>
        <p>Test any product. Build a routine that fits your budget. Track your skin safely.</p>
        <strong>SkinSabi is education, not medical advice.</strong>
      </div>
      <div className="signup-welcome__art-wrap"><Illustration name="hero-products" className="signup-welcome__art"/></div>
      <span className="hero-caption signup-welcome__caption"><Icon name="leaf" size={17}/> Your skin knows best.</span>
    </div>

    <section>
      <h1>Create your account</h1>
      <p>Free. Takes less than one minute.</p>
      <form className="card stack" onSubmit={submit}>
        <GoogleButton label="Sign up with Google"/>
        <p className="small auth-note">With Google you skip the form below and choose your skin details right after. SkinSabi gives general information, not medical advice.</p>
        <div className="auth-divider" role="separator"><span>or sign up with email</span></div>
        <Input label="Full name" required value={name} onChange={event => setName(event.target.value)} placeholder="Adaeze O." autoComplete="name"/>
        <Input label="Email" required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email"/>
        <Input label="Password (8+ characters)" required minLength={8} type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password"/>
        <Select label="Skin type" value={skin} onChange={event => setSkin(event.target.value)}>{["Oily", "Dry", "Combination", "Sensitive", "I Don't Know"].map(option => <option key={option}>{option}</option>)}</Select>
        <Select label="Main concern" value={concern} onChange={event => setConcern(event.target.value)}>{["Acne", "Dark Spots", "Both", "Something else"].map(option => <option key={option}>{option}</option>)}</Select>
        <Select label="Budget" value={budget} onChange={event => setBudget(event.target.value)}>{["Under ₦15k", "₦15k–₦30k", "₦30k+"].map(option => <option key={option}>{option}</option>)}</Select>
        <Select label="Where do you live? (optional)" value={state} onChange={event => setState(event.target.value)}>
          <option value="">Prefer not to say</option>
          {NIGERIAN_STATES.map(option => <option key={option}>{option}</option>)}
        </Select>
        <Input label="City or area (optional)" value={city} onChange={event => setCity(event.target.value)} placeholder="e.g. Port Harcourt" autoComplete="address-level2"/>
        <p className="small auth-note">We only use your state to show where to buy. We never use GPS.</p>
        <label className="check"><input required type="checkbox" checked={agree} onChange={event => setAgree(event.target.checked)}/> I understand SkinSabi gives general information, not medical advice. I will patch test new products.</label>
        <button type="submit" disabled={busy}>{busy ? "Creating your account…" : "Create Account & Build My Routine"}</button>
        {message && <p role="status">{message}</p>}
      </form>
      <p className="auth-switch">Already have an account? <Link href={loginHref}>Log in</Link></p>
    </section>
  </div>;
}
