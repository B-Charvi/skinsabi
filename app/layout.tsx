import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
export const metadata: Metadata = { title: "SkinSabi — Your skin sabi pass", description: "Test am, watch am, trust your skin. Skincare education built for Nigeria." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>; }
