"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  skin_type: string | null;
  main_concern: string | null;
  budget: string | null;
  state: string | null;
  city: string | null;
};

/** "demo" means Supabase is not connected (no env vars). Pages stay open so the site still works locally. */
export type AuthStatus = "loading" | "signedIn" | "signedOut" | "demo";

type AuthValue = {
  status: AuthStatus;
  user: User | null;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  status: "loading",
  user: null,
  profile: null,
  refreshProfile: async () => {},
  signOut: async () => {},
});

const WITH_USERNAME = "id,username,full_name,skin_type,main_concern,budget,state,city";
// Used until migration 003 (which adds the username column) has been run.
const WITHOUT_USERNAME = "id,full_name,skin_type,main_concern,budget,state,city";

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>(supabase ? "loading" : "demo");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let live = true;
    client.auth.getSession().then(({ data }) => {
      if (!live) return;
      setUser(data.session?.user ?? null);
      setStatus(data.session?.user ? "signedIn" : "signedOut");
    }).catch(() => { if (live) setStatus("signedOut"); });
    // Keep this callback synchronous: calling Supabase inside it can deadlock. The profile loads in a separate effect.
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStatus(session?.user ? "signedIn" : "signedOut");
    });
    return () => { live = false; listener.subscription.unsubscribe(); };
  }, []);

  const loadProfile = useCallback(async (id: string) => {
    const client = supabase;
    if (!client) return;
    const first = await client.from("profiles").select(WITH_USERNAME).eq("id", id).maybeSingle();
    if (!first.error) { setProfile(first.data ? (first.data as unknown as Profile) : null); return; }
    const older = await client.from("profiles").select(WITHOUT_USERNAME).eq("id", id).maybeSingle();
    setProfile(!older.error && older.data ? { ...(older.data as unknown as Profile), username: null } : null);
  }, []);

  const userId = user?.id ?? null;
  useEffect(() => {
    if (!userId) { setProfile(null); return; }
    void loadProfile(userId);
  }, [userId, loadProfile]);

  const refreshProfile = useCallback(async () => { if (userId) await loadProfile(userId); }, [userId, loadProfile]);

  const signOut = useCallback(async () => {
    try { await supabase?.auth.signOut(); } catch { /* signing out locally below either way */ }
    try {
      // Personal data only. Display preferences (ss-theme, ss-size, ss-font, ss-motion) belong to the device and stay.
      Object.keys(localStorage).filter(key => key.startsWith("skinsabi.")).forEach(key => localStorage.removeItem(key));
    } catch { /* storage can be blocked */ }
    setUser(null);
    setProfile(null);
    setStatus(supabase ? "signedOut" : "demo");
    router.replace("/");
  }, [router]);

  const value = useMemo(() => ({ status, user, profile, refreshProfile, signOut }), [status, user, profile, refreshProfile, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
