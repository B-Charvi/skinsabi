import type { Metadata } from "next";
import type { ReactNode } from "react";

// The admin page is private. Keep it out of search results.
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
