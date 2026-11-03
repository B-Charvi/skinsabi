"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSignedInHref } from "@/components/require-login";

/** "Build My Routine": goes to Sign up when signed out, and straight to the Routine when signed in. */
export function RoutineCta({ className, children }: { className: string; children: ReactNode }) {
  const href = useSignedInHref("/routine");
  return <Link className={className} href={href}>{children}</Link>;
}
