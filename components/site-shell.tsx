"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AccountMenu, useAccountLabels } from "@/components/account-menu";
import { useAuth } from "@/components/auth-provider";
import { Icon, SegmentedChoice } from "@/components/ui";

type Theme = "light" | "dark" | "auto";
type ReadingFont = "default" | "easy-read";
type MotionSetting = "auto" | "reduced";

const sizeOptions = [14, 16, 19, 22] as const;
const sizeLabels: Record<number, string> = { 14: "A−", 16: "A", 19: "A+", 22: "A++" };
const sizeCssValues: Record<number, string> = { 14: "90%", 16: "100%", 19: "112.5%", 22: "125%" };
const sizeDataValues: Record<number, string> = { 14: "small", 16: "normal", 19: "large", 22: "extra-large" };
// Same relative order in both states. Signed out sees only the open pages.
const signedOutNav = [["Home", "/"], ["Reviews", "/reviews"], ["Learn", "/learn"], ["Doctors", "/find-a-dermatologist"]];
const signedInNav = [["Home", "/"], ["Products", "/products"], ["Routine", "/routine"], ["Test & Watch", "/test-and-watch"], ["Reviews", "/reviews"], ["Learn", "/learn"], ["Doctors", "/find-a-dermatologist"]];

function resolvedTheme(theme: Theme) {
  if (theme !== "auto") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyMotionPreference(motion: MotionSetting) {
  const systemReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  document.documentElement.dataset.motion = motion === "reduced" || systemReduced || connection?.saveData ? "reduced" : "auto";
  document.documentElement.dataset.motionPreference = motion;
}

export function Wordmark({ size = "nav" }: { size?: "nav" | "footer" | "panel" }) {
  return <span className={`wordmark wordmark--${size}`} role="img" aria-label="SkinSabi">
    <span className="wordmark__letters" aria-hidden="true">skinsabi</span>
    <svg className="wordmark__swash" viewBox="0 0 175 26" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M3 15C32 5 58 22 88 11S138 6 160 13" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round"/>
      <path d="M158 14c2-8 9-12 17-11-1 8-8 13-17 11Z" fill="var(--color-leaf)"/>
    </svg>
  </span>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status, signOut } = useAuth();
  const labels = useAccountLabels();
  const signedIn = status === "signedIn";
  // With Supabase not connected ("demo") every page is open, so show the full set of links.
  const fullNav = signedIn || status === "demo";
  const primaryNav = fullNav ? signedInNav : signedOutNav;
  const [theme, setTheme] = useState<Theme>("light");
  const [size, setSize] = useState<number>(16);
  const [readingFont, setReadingFont] = useState<ReadingFont>("default");
  const [motion, setMotion] = useState<MotionSetting>("auto");
  const [displayOpen, setDisplayOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const displayDialog = useRef<HTMLDialogElement>(null);
  const menuDialog = useRef<HTMLDialogElement>(null);
  const displayButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("ss-theme") as Theme | null;
    const storedSize = Number(localStorage.getItem("ss-size") || 16);
    const storedFont = localStorage.getItem("ss-font") as ReadingFont | null;
    const storedMotion = localStorage.getItem("ss-motion") as MotionSetting | null;
    const nextTheme = storedTheme === "dark" || storedTheme === "auto" ? storedTheme : "light";
    const nextSize = sizeOptions.includes(storedSize as (typeof sizeOptions)[number]) ? storedSize : 16;
    const nextFont = storedFont === "easy-read" ? storedFont : "default";
    const nextMotion = storedMotion === "reduced" ? storedMotion : "auto";

    setTheme(nextTheme);
    setSize(nextSize);
    setReadingFont(nextFont);
    setMotion(nextMotion);
    document.documentElement.style.fontSize = sizeCssValues[nextSize];
    document.documentElement.dataset.size = sizeDataValues[nextSize];
    document.documentElement.dataset.theme = resolvedTheme(nextTheme);
    document.documentElement.style.colorScheme = resolvedTheme(nextTheme);
    document.documentElement.dataset.font = nextFont;
    applyMotionPreference(nextMotion);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemPreferences = () => {
      if (theme === "auto") {
        document.documentElement.dataset.theme = resolvedTheme("auto");
        document.documentElement.style.colorScheme = resolvedTheme("auto");
      }
      applyMotionPreference(motion);
    };
    media.addEventListener("change", updateSystemPreferences);
    const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
    connection?.addEventListener("change", updateSystemPreferences);
    return () => {
      media.removeEventListener("change", updateSystemPreferences);
      connection?.removeEventListener("change", updateSystemPreferences);
    };
  }, [theme, motion]);

  useEffect(() => {
    const dialog = displayDialog.current;
    if (!dialog) return;
    if (displayOpen && !dialog.open) dialog.showModal();
    if (!displayOpen && dialog.open) dialog.close();
  }, [displayOpen]);

  useEffect(() => {
    const dialog = menuDialog.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);

  function changeTheme(value: Theme) {
    setTheme(value);
    localStorage.setItem("ss-theme", value);
    const resolved = resolvedTheme(value);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }

  function changeSize(value: string) {
    const nextSize = Number(value);
    setSize(nextSize);
    localStorage.setItem("ss-size", String(nextSize));
    document.documentElement.style.fontSize = sizeCssValues[nextSize];
    document.documentElement.dataset.size = sizeDataValues[nextSize];
  }

  function changeFont(value: ReadingFont) {
    setReadingFont(value);
    localStorage.setItem("ss-font", value);
    document.documentElement.dataset.font = value;
  }

  function changeMotion(value: MotionSetting) {
    setMotion(value);
    localStorage.setItem("ss-motion", value);
    applyMotionPreference(value);
  }

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  async function logOutFromSheet() {
    menuDialog.current?.close();
    await signOut();
  }

  // One set of Display controls, shown in the signed-out dialog, the Profile menu (Settings) and the mobile menu.
  const displayControls = <>
    <SegmentedChoice label="Theme" value={theme} onChange={changeTheme} options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "auto", label: "Auto" }]}/>
    <fieldset className="segmented-choice"><legend>Text size</legend><div className="segmented-choice__options">{sizeOptions.map(value => <button key={value} type="button" className="segmented-choice__option" aria-pressed={size === value} aria-label={`${sizeLabels[value]} text size`} onClick={() => changeSize(String(value))}>{sizeLabels[value]}</button>)}</div></fieldset>
    <SegmentedChoice label="Reading font" value={readingFont} onChange={changeFont} options={[{ value: "default", label: "Default" }, { value: "easy-read", label: "Easy-read" }]}/>
    <SegmentedChoice label="Motion" value={motion} onChange={changeMotion} options={[{ value: "auto", label: "Auto" }, { value: "reduced", label: "Reduced" }]}/>
    <p className="display-panel__note">Auto follows your device settings and data-saving preferences.</p>
  </>;

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="SkinSabi home"><Wordmark/></Link>
        <nav className="site-nav" aria-label="Main navigation">
          {primaryNav.map(([label, href]) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="site-header__actions">
          {!signedIn && <button ref={displayButton} className="display-trigger display-trigger--icon" type="button" aria-label="Display settings" aria-haspopup="dialog" aria-expanded={displayOpen} onClick={() => setDisplayOpen(true)}><Icon name="sliders" size={21}/></button>}
          {status === "loading" && <span className="account-placeholder" aria-hidden="true"/>}
          {signedIn && <AccountMenu settings={displayControls}/>}
          {(status === "signedOut" || status === "demo") && <>
            <Link className="nav-login" href="/login">Log in</Link>
            <Link className="nav-signup button button--cta" href="/signup">Sign up</Link>
          </>}
          <button ref={menuButton} className="menu-trigger" type="button" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Icon name="menu" size={23}/></button>
        </div>
      </div>
    </header>

    <main id="main-content" className="page-container" tabIndex={-1}>{children}</main>

    <footer className="site-footer">
      <div className="page-container site-footer__grid">
        <section className="site-footer__brand" aria-label="SkinSabi">
          <Link href="/" className="site-footer__wordmark"><Wordmark size="footer"/></Link>
          <p>Test am, watch am, trust your skin.</p>
          <p className="site-footer__notice">General skincare education, not medical advice. Your skin knows best.</p>
        </section>
        <nav aria-label="Explore SkinSabi" className="site-footer__links"><h2>Explore</h2><Link href="/">Home</Link>{fullNav && <><Link href="/products">Products</Link><Link href="/routine">Routine</Link><Link href="/test-and-watch">Test &amp; Watch</Link></>}<Link href="/learn">Learn</Link><Link href="/reviews">Reviews</Link></nav>
        <nav aria-label="Trust and support" className="site-footer__links"><h2>Trust &amp; support</h2><Link href="/#medical-disclaimer">Disclaimer</Link><Link href="/privacy">Privacy</Link><Link href="/find-a-dermatologist">Dermatologist directory</Link></nav>
      </div>
      <div className="page-container site-footer__bottom"><span>SkinSabi</span><span>For thoughtful, gentle skincare decisions.</span></div>
    </footer>

    <dialog ref={displayDialog} className="display-panel" aria-labelledby="display-title" onClose={() => { setDisplayOpen(false); displayButton.current?.focus(); }}>
      <div className="display-panel__header"><div><p className="eyebrow">Make it comfortable</p><h2 id="display-title">Display settings</h2></div><button className="icon-button" type="button" aria-label="Close display settings" onClick={() => displayDialog.current?.close()}><Icon name="close"/></button></div>
      <div className="display-panel__body">{displayControls}</div>
    </dialog>

    <dialog ref={menuDialog} className="menu-sheet" aria-labelledby="menu-title" onClose={() => { setMenuOpen(false); menuButton.current?.focus(); }}>
      <div className="menu-sheet__header"><Link href="/" className="site-header__brand" aria-label="SkinSabi home" onClick={() => menuDialog.current?.close()}><Wordmark/></Link><button className="icon-button" type="button" aria-label="Close navigation menu" onClick={() => menuDialog.current?.close()}><Icon name="close"/></button></div>
      <h2 id="menu-title" className="visually-hidden">Site navigation</h2>
      <nav className="menu-sheet__links" aria-label="Mobile navigation">{primaryNav.map(([label, href]) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} onClick={() => menuDialog.current?.close()}>{label}<Icon name="arrow-right" size={20}/></Link>)}</nav>
      {status !== "loading" && <div className="menu-sheet__account">
        {signedIn ? <>
          <div className="account-menu__who"><strong>{labels.name}</strong>{labels.email && <small>{labels.email}</small>}</div>
          <nav className="menu-sheet__links" aria-label="Your account">
            <Link href="/profile" onClick={() => menuDialog.current?.close()}>Edit profile<Icon name="arrow-right" size={20}/></Link>
            <Link href="/privacy" onClick={() => menuDialog.current?.close()}>Privacy<Icon name="arrow-right" size={20}/></Link>
          </nav>
          <details className="menu-sheet__settings"><summary>Settings<Icon name="chevron-down" size={18}/></summary><div className="display-panel__body">{displayControls}</div></details>
          <button className="menu-sheet__logout button button--secondary" type="button" onClick={logOutFromSheet}><Icon name="log-out" size={18}/>Log out</button>
        </> : <>
          <div className="menu-sheet__auth">
            <Link className="button button--secondary" href="/login" onClick={() => menuDialog.current?.close()}>Log in</Link>
            <Link className="button button--cta" href="/signup" onClick={() => menuDialog.current?.close()}>Sign up</Link>
          </div>
          <details className="menu-sheet__settings"><summary>Display settings<Icon name="chevron-down" size={18}/></summary><div className="display-panel__body">{displayControls}</div></details>
        </>}
      </div>}
    </dialog>
  </>;
}
