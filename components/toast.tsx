"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/ui";

export type ToastMessage = {
  /** Change this for every new message so a repeat of the same text still shows and restarts the timer. */
  id: number;
  tone: "success" | "info" | "error";
  title: string;
  message?: string;
  action?: { label: string; href: string };
};

const ICONS: Record<ToastMessage["tone"], IconName> = { success: "circle-check", info: "info", error: "warning" };

/**
 * A small pop-up near the bottom of the screen for "it worked" and "it did not work" messages
 * that would otherwise appear somewhere the person is not looking.
 * It closes itself after a few seconds, but waits while the pointer or keyboard focus is on it. Escape or the close button dismisses it.
 */
export function Toast({ toast, onClose }: { toast: ToastMessage | null; onClose: () => void }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!toast || paused) return;
    const timer = window.setTimeout(onClose, toast.tone === "error" ? 10000 : 7000);
    return () => window.clearTimeout(timer);
  }, [toast, paused, onClose]);

  useEffect(() => {
    if (!toast) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast, onClose]);

  // The region stays on the page so screen readers are already listening when a message arrives.
  return <div className="toast-region" aria-live="polite">
    {toast && <div
      key={toast.id}
      className={`toast toast--${toast.tone}`}
      role={toast.tone === "error" ? "alert" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="toast__icon" aria-hidden="true"><Icon name={ICONS[toast.tone]} size={22}/></span>
      <div className="toast__copy">
        <p className="toast__title">{toast.title}</p>
        {toast.message && <p className="toast__message">{toast.message}</p>}
        {toast.action && <Link className="toast__action" href={toast.action.href} onClick={onClose}>{toast.action.label}</Link>}
      </div>
      <button type="button" className="toast__close" aria-label="Dismiss message" onClick={onClose}><Icon name="close" size={18}/></button>
    </div>}
  </div>;
}
