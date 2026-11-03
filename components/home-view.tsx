import Link from "next/link";
import { analyze } from "@/lib/catalog";
import { lessons } from "@/lib/lessons";
import { AmbientSprites } from "@/components/ambient-sprites";
import { RoutineCta } from "@/components/auth-cta";
import { Illustration } from "@/components/illustration";
import { Badge, Callout, Card, Chip, Icon } from "@/components/ui";

const exampleList = "Aqua, Glycerin, Niacinamide, Fragrance";
const exampleResults = analyze(exampleList);
const exampleGroups = [
  { label: "Red flag", values: exampleResults.filter(item => item.flag === "Red Flag"), icon: "warning" as const },
  { label: "Yellow flag", values: exampleResults.filter(item => item.flag === "Yellow Flag"), icon: "warning" as const },
  { label: "Green flag", values: exampleResults.filter(item => item.flag === "Green Flag"), icon: "check" as const },
  { label: "Unknown", values: exampleResults.filter(item => item.flag === "Unknown Ingredient"), icon: "info" as const },
];

const toneSwatches = [
  { name: "Deep", color: "#4A2E22" },
  { name: "Medium-deep", color: "#7B4B30" },
  { name: "Medium", color: "#A86B43" },
  { name: "Light", color: "#CF9A6E" },
  { name: "Fair", color: "#E7BE97" },
  { name: "Albinism", color: "#F6DCCB" },
];

export function HomeView() {
  return <>
    <section className="home-hero ambient-host">
      <AmbientSprites side="right"/>
      <div className="home-hero__copy">
        <p className="eyebrow">Skincare that starts with your skin</p>
        <h1>Your skin <span className="hand-underline">sabi<svg aria-hidden="true" viewBox="0 0 150 20"><path d="M4 13c28-10 40 4 69-2s46-7 73 0"/></svg></span> pass.</h1>
        <p className="home-hero__lede">Test am, watch am, trust your skin. Build a gentle routine that fits your skin, your budget, and your life in Nigeria.</p>
        <div className="home-hero__actions">
          <RoutineCta className="button button--cta">Build My Routine <Icon name="arrow-right"/></RoutineCta>
          <Link className="button button--secondary" href="/products">Check an ingredient</Link>
        </div>
        <div className="tone-swatch-row"><span>Made for your skin</span><div className="tone-swatch-row__swatches" role="img" aria-label="Six Nigerian skin tone swatches">{toneSwatches.map(swatch => <i key={swatch.name} className="tone-swatch" style={{ backgroundColor: swatch.color }} aria-hidden="true"/>)}</div></div>
      </div>
      <div className="home-hero__art-wrap">
        <div className="home-hero__arch"><Illustration name="hero-products" className="home-hero__portrait"/></div>
        <span className="hero-caption"><Icon name="leaf" size={17}/> Your skin knows best.</span>
      </div>
    </section>

    <Callout tone="warning" id="medical-disclaimer" title="IMPORTANT — NOT MEDICAL ADVICE" className="medical-disclaimer">
      SkinSabi gives general skincare education, not a diagnosis or medical advice. Patch test new products. Stop and seek medical care for swelling, hives, blisters, open sores, or burning that does not stop.
    </Callout>

    <section className="home-tools" aria-labelledby="home-tools-title">
      <div className="section-heading"><div><p className="eyebrow">Your next gentle step</p><h2 id="home-tools-title">Your skincare tools</h2></div><Link className="text-link" href="/products">Explore all tools <Icon name="arrow-right" size={18}/></Link></div>
      <div className="home-tools__grid">
        <Card className="home-feature-card"><span className="home-feature-card__number">01</span><h3>Daily Skin Check</h3><p>Short check-ins are available during your first 14 days with a new product.</p><Link href="/test-and-watch" className="text-link">Start today’s check-in <Icon name="arrow-right" size={18}/></Link></Card>
        <Card className="home-feature-card"><span className="home-feature-card__number">02</span><h3>Today’s routine</h3><p>Morning: gentle cleanse, moisturize, SPF 30+. Night: gentle cleanse, one treatment at a time, moisturize.</p><Link href="/routine" className="text-link">See your routine <Icon name="arrow-right" size={18}/></Link></Card>
        <Card className="home-feature-card"><span className="home-feature-card__number">03</span><h3>Products</h3><p>Check saved ingredients or paste an INCI label. We never guess from a brand name.</p><Link href="/products" className="text-link">Open ingredient checker <Icon name="arrow-right" size={18}/></Link></Card>
      </div>
    </section>

    <section className="how-it-works" aria-labelledby="how-title">
      <div className="section-heading section-heading--center"><p className="eyebrow">Small steps, steady care</p><h2 id="how-title">How it works</h2><p>Take one step at a time. Your skin knows best.</p></div>
      <ol className="how-steps">
        <li className="how-step"><span className="how-step__count">01</span><Illustration name="check-label" className="how-step__art"/><h3>Check the label</h3><p>Look at the ingredient list and check what is known.</p></li>
        <li className="how-step"><span className="how-step__count">02</span><Illustration name="patch-test" className="how-step__art"/><h3>Patch test</h3><p>Introduce one new product carefully, a little at a time.</p></li>
        <li className="how-step"><span className="how-step__count">03</span><Illustration name="watch-skin" className="how-step__art"/><h3>Watch your skin</h3><p>Keep track of comfort and changes before adjusting your routine.</p></li>
      </ol>
    </section>

    <section className="example-section" aria-labelledby="example-title">
      <div className="example-section__intro"><p className="eyebrow">A clear way to read a label</p><h2 id="example-title">See how the ingredient checker works</h2><p>SkinSabi checks the ingredients you enter against its existing flags. It does not diagnose your skin.</p><span className="example-note">Example list, not a real product</span></div>
      <Card className="example-card">
        <div className="example-card__label"><Icon name="search" size={18}/><span>Ingredient label</span></div>
        <p className="example-card__ingredients">{exampleList}</p>
        <div className="example-card__groups">{exampleGroups.map(group => <div className="example-result" key={group.label}>
          <div className="example-result__heading"><span className={`example-result__icon example-result__icon--${group.label.toLowerCase().replace(" ", "-")}`}><Icon name={group.icon} size={16}/></span><span>{group.label}</span><Badge tone="neutral">{group.values.length}</Badge></div>
          {group.values.length > 0 ? <ul>{group.values.map((item, index) => <li key={`${group.label}-${item.name}`}><span>{item.name}</span>{item.index < 3 && <Chip tone="quiet">Top 3</Chip>}</li>)}</ul> : <p className="example-result__empty">No ingredients in this group</p>}
        </div>)}</div>
        <Link className="text-link" href="/products">Check your own label <Icon name="arrow-right" size={18}/></Link>
      </Card>
    </section>

    <section className="learn-highlights" aria-labelledby="learn-title">
      <div className="section-heading"><div><p className="eyebrow">Clear answers, at your pace</p><h2 id="learn-title">Learn at your pace</h2></div><Link className="text-link" href="/learn">Visit Learn <Icon name="arrow-right" size={18}/></Link></div>
      <div className="learn-highlights__grid">{lessons.slice(0, 3).map((lesson, index) => <Card className="learn-card" key={lesson.slug}>
        <span className="lesson-card__tile"><Icon name={lesson.icon} size={32}/></span><span className="learn-card__number">0{index + 1}</span><h3>{lesson.title}</h3><Link className="text-link" href="/learn">Read lesson <Icon name="arrow-right" size={18}/></Link>
      </Card>)}</div>
    </section>

    <section className="tone-band" aria-labelledby="tone-band-title">
      <div><p className="eyebrow">Skin care should welcome everyone</p><h2 id="tone-band-title">Made for every Nigerian skin tone</h2><p>Every shade, every story. Start with care that listens to your skin.</p></div>
      <div className="tone-band__grid" aria-label="Display-only skin tone swatches">{toneSwatches.map(swatch => <div className="tone-sample" key={swatch.name}><span className="tone-sample__pebble" style={{ backgroundColor: swatch.color }} aria-hidden="true"/><span className="tone-sample__label">{swatch.name}</span></div>)}</div>
    </section>

    <section className="closing-cta" aria-labelledby="closing-title">
      <div className="closing-cta__mark" aria-hidden="true"><Icon name="leaf" size={33}/></div><p className="eyebrow">Your skin knows best</p><h2 id="closing-title">Start with what your skin needs.</h2><p>Keep it gentle. Make one change at a time. Give your skin room to tell you how it feels.</p><RoutineCta className="button button--cta">Build My Routine <Icon name="arrow-right"/></RoutineCta>
    </section>
  </>;
}
