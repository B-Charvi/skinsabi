"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button, Callout, Input, Select } from "@/components/ui";
import { NIGERIAN_STATES } from "@/lib/nigeria-states";
import { matchOption, nextFromLocation } from "@/lib/safe-next";
import { supabase } from "@/lib/supabase";

const skinOptions = ["Oily", "Dry", "Combination", "Sensitive", "I Don't Know"];
const concernOptions = ["Acne", "Dark Spots", "Both", "Something else"];
const budgetOptions = ["Under ₦15k", "₦15k–₦30k", "₦30k+"];
const reserved = ["admin", "administrator", "skinsabi", "support", "help", "root", "moderator"];

type Note = { tone: "success" | "danger"; text: string } | null;

export function ProfileForm() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const touched = useRef(false);
  // ?welcome=1 is set right after someone's first Google sign in. It adds a short welcome and moves them on after saving.
  const [welcome, setWelcome] = useState(false);
  const [after, setAfter] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [skin, setSkin] = useState("");
  const [concern, setConcern] = useState("");
  const [budget, setBudget] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState<Note>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try { setWelcome(new URLSearchParams(window.location.search).get("welcome") === "1"); } catch { /* ignore */ }
    setAfter(nextFromLocation(""));
  }, []);

  // Fill the form from the saved profile (or the signup details) until the person starts typing.
  useEffect(() => {
    if (touched.current) return;
    const meta = (user?.user_metadata ?? {}) as Record<string, string | undefined>;
    setUsername(profile?.username ?? "");
    setFullName(profile?.full_name ?? meta.full_name ?? "");
    setSkin(matchOption(profile?.skin_type ?? meta.skin_type, skinOptions));
    setConcern(matchOption(profile?.main_concern ?? meta.main_concern, concernOptions));
    setBudget(matchOption(profile?.budget ?? meta.budget, budgetOptions));
    setState(matchOption(profile?.state ?? meta.state, NIGERIAN_STATES));
    setCity(profile?.city ?? meta.city ?? "");
  }, [profile, user]);

  function edit(setter: (value: string) => void) {
    return (value: string) => { touched.current = true; setNote(null); setter(value); };
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !user) { setNote({ tone: "danger", text: "Connect Supabase and log in to save your profile." }); return; }
    const handle = username.trim().toLowerCase();
    if (handle && !/^[a-z0-9_]{3,24}$/.test(handle)) { setNote({ tone: "danger", text: "Use 3 to 24 letters, numbers or underscores." }); return; }
    if (handle && reserved.includes(handle)) { setNote({ tone: "danger", text: "That username is not available. Try another." }); return; }

    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: handle || null,
      full_name: fullName.trim() || null,
      skin_type: skin || null,
      main_concern: concern || null,
      budget: budget || null,
      state: state || null,
      city: city.trim() || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
    setSaving(false);

    if (error) {
      if (error.code === "23505") setNote({ tone: "danger", text: "That username is taken. Try another." });
      else if (error.code === "23514") setNote({ tone: "danger", text: "Use 3 to 24 letters, numbers or underscores." });
      else if (error.code === "42703" || error.code === "PGRST204") setNote({ tone: "danger", text: "Usernames are not switched on yet. The latest database update still needs to be run." });
      else setNote({ tone: "danger", text: "We could not save that. Check your connection and try again." });
      return;
    }
    setUsername(handle);
    await refreshProfile();
    if (welcome) { router.replace(after || "/routine"); return; }
    setNote({ tone: "success", text: "Saved." });
  }

  return <form className="profile-form stack" onSubmit={save}>
    <header className="page-header">
      <p className="eyebrow">{welcome ? "Welcome to SkinSabi" : "Your account"}</p>
      <h1>{welcome ? "Tell us about your skin" : "Your profile"}</h1>
      <p className="page-header__description">{welcome ? "Pick what fits you best so your routine and product matches make sense. You can change any of this later." : "Change how you appear and what your routine is based on."}</p>
    </header>

    <section className="card stack" aria-labelledby="profile-account">
      <h2 id="profile-account">Account</h2>
      <div className="stack">
        <Input label="Username" value={username} onChange={event => edit(setUsername)(event.target.value)} placeholder="e.g. adaeze_o" autoComplete="username" maxLength={24}/>
        <p className="small auth-note">3 to 24 characters: letters, numbers and underscore. This is how you appear in the menu.</p>
      </div>
      <Input label="Full name" value={fullName} onChange={event => edit(setFullName)(event.target.value)} autoComplete="name"/>
      <Input label="Email" value={user?.email ?? ""} readOnly aria-readonly="true"/>
    </section>

    <section className="card stack" aria-labelledby="profile-skin">
      <h2 id="profile-skin">Your skin</h2>
      <Select label="Skin type" value={skin} onChange={event => edit(setSkin)(event.target.value)}>
        <option value="">Choose</option>
        {skinOptions.map(option => <option key={option}>{option}</option>)}
      </Select>
      <Select label="Main concern" value={concern} onChange={event => edit(setConcern)(event.target.value)}>
        <option value="">Choose</option>
        {concernOptions.map(option => <option key={option}>{option}</option>)}
      </Select>
      <Select label="Budget" value={budget} onChange={event => edit(setBudget)(event.target.value)}>
        <option value="">Choose</option>
        {budgetOptions.map(option => <option key={option}>{option}</option>)}
      </Select>
    </section>

    <section className="card stack" id="state" aria-labelledby="profile-location">
      <h2 id="profile-location">Location</h2>
      <Select label="Where do you live?" value={state} onChange={event => edit(setState)(event.target.value)}>
        <option value="">Prefer not to say</option>
        {NIGERIAN_STATES.map(option => <option key={option}>{option}</option>)}
      </Select>
      <Input label="City or area (optional)" value={city} onChange={event => edit(setCity)(event.target.value)} autoComplete="address-level2"/>
      <p className="small auth-note">We only use your state to show where to buy and delivery notes. We never use GPS and we never share it.</p>
    </section>

    <div className="profile-form__actions">
      <Button type="submit" size="large" disabled={saving}>{saving ? "Saving…" : welcome ? "Save and build my routine" : "Save changes"}</Button>
      {welcome && <p className="auth-switch"><Link href={after || "/"}>Skip for now</Link></p>}
      <div role="status" aria-live="polite">{note && <Callout tone={note.tone}>{note.text}</Callout>}</div>
    </div>
  </form>;
}
