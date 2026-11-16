"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";

export type AdminState = "checking" | "yes" | "no";

/**
 * Asks the database whether this session is an admin. Only the answer decides what the page shows.
 * The real protection is Row Level Security: even if someone forces the page open, every admin read and write is refused.
 */
export function useIsAdmin(): AdminState {
  const { status, user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState<AdminState>("checking");

  useEffect(() => {
    if (status === "loading") { setState("checking"); return; }
    if (status !== "signedIn" || !supabase || !userId) { setState("no"); return; }
    let live = true;
    setState("checking");
    supabase.rpc("is_admin").then(({ data, error }) => {
      if (live) setState(!error && data === true ? "yes" : "no");
    });
    return () => { live = false; };
  }, [status, userId]);

  return state;
}
