"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth-provider";
import { Icon } from "@/components/ui";

/** How the signed-in person is named in the menu: @username, then full name, then the start of the email. */
export function useAccountLabels() {
  const { user, profile } = useAuth();
  const meta = (user?.user_metadata ?? {}) as { full_name?: string };
  const fullName = profile?.full_name || meta.full_name || "";
  const emailName = user?.email ? user.email.split("@")[0] : "";
  const name = profile?.username ? `@${profile.username}` : fullName || emailName || "Your account";
  const initialSource = profile?.username || fullName || emailName || "S";
  const initial = (initialSource.match(/[A-Za-z0-9]/)?.[0] ?? "S").toUpperCase();
  return { name, initial, email: user?.email ?? "" };
}

type View = "menu" | "settings";

/** The signed-in "Profile" button and its dropdown. `settings` holds the Display controls. */
export function AccountMenu({ settings }: { settings: ReactNode }) {
  const { signOut } = useAuth();
  const { name, initial, email } = useAccountLabels();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("menu");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const cameFromSettings = useRef(false);

  function close(returnFocus = false) {
    setOpen(false);
    setView("menu");
    if (returnFocus) triggerRef.current?.focus();
  }

  // Close when the page changes.
  useEffect(() => { setOpen(false); setView("menu"); }, [pathname]);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) close();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close(true);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Keep keyboard focus sensible when switching between the two views.
  useEffect(() => {
    if (!open) return;
    if (view === "settings") { cameFromSettings.current = true; backRef.current?.focus(); }
    else if (cameFromSettings.current) { cameFromSettings.current = false; settingsButtonRef.current?.focus(); }
  }, [view, open]);

  async function logOut() {
    close();
    await signOut();
  }

  return <div className="account-menu" ref={rootRef}>
    <button ref={triggerRef} className="account-menu__trigger" type="button" aria-expanded={open} aria-controls="account-menu-panel" onClick={() => { setOpen(value => !value); setView("menu"); }}>
      <span className="account-menu__avatar" aria-hidden="true">{initial}</span>
      <span>Profile</span>
      <Icon name="chevron-down" size={16} className="account-menu__chevron"/>
    </button>
    {open && <div id="account-menu-panel" className="account-menu__panel" role="group" aria-label="Profile menu">
      {view === "menu" ? <>
        <div className="account-menu__who"><strong>{name}</strong>{email && <small>{email}</small>}</div>
        <Link className="account-menu__item" href="/profile" onClick={() => close()}>Edit profile</Link>
        <button ref={settingsButtonRef} className="account-menu__item" type="button" onClick={() => setView("settings")}>Settings<Icon name="chevron-right" size={18}/></button>
        <Link className="account-menu__item" href="/privacy" onClick={() => close()}>Privacy</Link>
        <hr className="account-menu__divider"/>
        <button className="account-menu__item" type="button" onClick={logOut}><Icon name="log-out" size={18}/>Log out</button>
      </> : <>
        <button ref={backRef} className="account-menu__back" type="button" onClick={() => setView("menu")}><Icon name="arrow-left" size={18}/>Settings</button>
        <div className="account-menu__settings">{settings}</div>
      </>}
    </div>}
  </div>;
}
