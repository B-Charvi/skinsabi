"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { RecommendedProducts } from "@/components/recommended-products";
import { supabase } from "@/lib/supabase";
import { matchOption } from "@/lib/safe-next";
import { buildRoutinePlan, type Step } from "@/lib/routine-plan";
import { Chip } from "@/components/ui";

type RoutineRow = { morning?: string[]; evening?: string[]; skin_type?: string; concern?: string; budget?: string; sandwich_mode?: boolean };
const skinOptions = ["I don't know", "Oily", "Dry", "Combination", "Sensitive"];
const concernOptions = ["Acne", "Dark Spots", "Both", "Something else"];
const budgetOptions = ["Under ₦15k", "₦15k–₦30k", "₦30k+"];
const baseMorning = ["Gentle cleanser (or water only if dry)", "Moisturizer", "Sunscreen SPF 30+; reapply outdoors"];
const baseEvening = ["Gentle cleanser", "One treatment only (optional)", "Moisturizer"];

function RoutineStep({ step, showProductLink = false, note }: { step: Step; showProductLink?: boolean; note?: string }) {
  return <li className="routine-step">
    <strong>{step.name}</strong>
    <p><strong>Look for:</strong> {step.look}</p>
    <small>{step.why}</small>
    {step.later && <p className="routine-step__later"><strong>Add later:</strong> {step.later}</p>}
    {showProductLink && <a className="routine-step__link" href="/products">Find one in Products</a>}
    {note && <p className="routine-step__note"><small>{note}</small></p>}
  </li>;
}

export function RoutineBuilder() {
  const [skin, setSkin] = useState("I don't know");
  const [concern, setConcern] = useState("Both");
  const [budget, setBudget] = useState("Under ₦15k");
  const [sandwich, setSandwich] = useState(false);
  const [morning, setMorning] = useState(baseMorning);
  const [evening, setEvening] = useState(baseEvening);
  const [status, setStatus] = useState("Loading saved routine…");
  const { profile } = useAuth();
  const savedApplied = useRef(false);
  const state = profile?.state ?? "";
  const gentle = skin === "Sensitive" || skin === "I don't know";
  const plan = buildRoutinePlan({ skin: skin as Parameters<typeof buildRoutinePlan>[0]["skin"], concern: concern as Parameters<typeof buildRoutinePlan>[0]["concern"], budget: budget as Parameters<typeof buildRoutinePlan>[0]["budget"] });

  // Start from what the person told us at signup, unless they have a saved routine.
  useEffect(() => {
    if (!profile || savedApplied.current) return;
    const nextSkin = matchOption(profile.skin_type, skinOptions);
    const nextConcern = matchOption(profile.main_concern, concernOptions);
    const nextBudget = matchOption(profile.budget, budgetOptions);
    if (nextSkin) setSkin(nextSkin);
    if (nextConcern) setConcern(nextConcern);
    if (nextBudget) setBudget(nextBudget);
  }, [profile]);

  useEffect(() => {
    let live = true;
    async function load() {
      if (!supabase) { setStatus("Routine saves are available after Supabase is configured."); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus("Log in to save your routine. Your selections stay on this page for now."); return; }
      const { data, error } = await supabase.from("user_routines").select("morning,evening,skin_type,concern,budget,sandwich_mode").eq("user_id", user.id).maybeSingle();
      if (!live) return;
      if (error) { setStatus(error.message); return; }
      if (data) {
        savedApplied.current = true;
        const r = data as RoutineRow;
        setMorning(r.morning || baseMorning);
        setEvening(r.evening || baseEvening);
        if (r.skin_type) setSkin(r.skin_type);
        if (r.concern) setConcern(r.concern);
        if (r.budget) setBudget(r.budget);
        setSandwich(!!r.sandwich_mode);
      }
      setStatus("Routine loaded.");
    }
    void load();
    return () => { live = false; };
  }, []);

  async function save() {
    if (!supabase) { setStatus("Add Supabase credentials to enable saving."); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStatus("Please log in before saving your routine."); return; }
    const m = gentle ? baseMorning : morning;
    const e = gentle ? ["Gentle cleanser", "No treatment for now — gentle care only", "Moisturizer"] : evening;
    const { error } = await supabase.from("user_routines").upsert({ user_id: user.id, morning: m, evening: e, skin_type: skin, concern, budget, sandwich_mode: sandwich, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    setStatus(error ? `Could not save: ${error.message}` : "Routine saved to your account.");
  }

  return <>
    <section className="page-header">
      <p className="eyebrow">A routine for your real life</p>
      <h1>Build My Routine</h1>
      <p className="page-header__description">Start simple. Keep what works, and add only one new treatment at a time.</p>
    </section>

    <section className="card stack routine-controls">
      <label>Skin type<select value={skin} onChange={e => setSkin(e.target.value)}>{["I don't know", "Oily", "Dry", "Combination", "Sensitive"].map(x => <option key={x}>{x}</option>)}</select></label>
      <label>Main concern<select value={concern} onChange={e => setConcern(e.target.value)}>{["Acne", "Dark Spots", "Both", "Something else"].map(x => <option key={x}>{x}</option>)}</select></label>
      <label>Budget<select value={budget} onChange={e => setBudget(e.target.value)}>{["Under ₦15k", "₦15k–₦30k", "₦30k+"].map(x => <option key={x}>{x}</option>)}</select></label>
    </section>

    {gentle && <div className="warn">We started with Gentle Only because we want to be safe. As we learn your skin, we can adjust. For redness, stinging, or reactive skin, check with a dermatologist before adding treatments.</div>}

    <section className="routine-plan-grid" aria-label="Your personalised routine plan">
      <article className="card routine-plan-card routine-plan-card--summary">
        <h2>Your plan</h2>
        <h3>{plan.budget.headline}</h3>
        <p>{plan.budget.note}</p>
        <div className="routine-plan__chips">{plan.chips.map((chip, i) => <Chip key={`${i}-${chip}`} tone="neutral">{chip}</Chip>)}</div>
      </article>

      <RecommendedProducts skin={skin} concern={concern} budget={budget} state={state}/>

      <article className="card routine-plan-card">
        <h2>Morning</h2>
        <ol className="routine-plan__steps">{plan.morning.map((step, i) => <RoutineStep key={`${step.name}-${i}`} step={step} showProductLink/>)}</ol>
      </article>

      <article className="card routine-plan-card">
        <h2>Night</h2>
        <ol className="routine-plan__steps">{plan.night.map((step, i) => <RoutineStep key={`${step.name}-${i}`} step={step} showProductLink={step.name === "Cleanser" || step.name === "Moisturiser"} note={i === 1 ? "We do not list treatment products yet. Choose one by the ingredient named above and read the label." : undefined}/>)}</ol>
      </article>

      <article className="card routine-plan-card">
        <h2>Avoid for now</h2>
        <ul>{plan.avoid.map(item => <li key={item}>{item}</li>)}</ul>
        <h3>See a doctor if</h3>
        <p>{plan.seeDoctor}</p>
      </article>
    </section>

    <section className="card routine-sandwich">
      <h2>Sandwich Method</h2>
      <p>For mild, brief tingling from a treatment on non-reactive skin: thin moisturizer → pea-sized treatment → thin moisturizer. Wait 5 minutes between layers. Use 2–3 nights per week.</p>
      <label className="check"><input type="checkbox" checked={sandwich} disabled={gentle} onChange={e => setSandwich(e.target.checked)}/> Use Sandwich Method</label>
      {sandwich && !gentle && <p>Night: cleanser → thin moisturizer (wait 5 mins) → treatment → thin moisturizer again. Do not use this to make a red-flag product safe.</p>}
    </section>

    <button onClick={save}>Save Routine</button>
    <p role="status">{status}</p>
  </>;
}
