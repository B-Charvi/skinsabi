import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

const displayFont = Fraunces({ variable: "--font-display", subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT"], display: "swap" });
const uiFont = Figtree({ variable: "--font-ui", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const easyReadFont = Atkinson_Hyperlegible({ variable: "--font-easy-read", subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false });

export const metadata: Metadata = {
  title: "SkinSabi — Your skin sabi pass",
  description: "Test am, watch am, trust your skin. Skincare education built for Nigeria.",
  appleWebApp: { capable: true, title: "SkinSabi", statusBarStyle: "default" },
  manifest: "/manifest.webmanifest",
};

const themeInit = `(()=>{try{const r=document.documentElement;const t=localStorage.getItem("ss-theme")||"light";const d=t==="auto"?matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":t;r.dataset.theme=d;r.style.colorScheme=d;const s=Number(localStorage.getItem("ss-size")||16);const valid=[14,16,19,22].includes(s)?s:16;r.style.fontSize=({14:"90%",16:"100%",19:"112.5%",22:"125%"})[valid];r.dataset.size=({14:"small",16:"normal",19:"large",22:"extra-large"})[valid];r.dataset.font=localStorage.getItem("ss-font")==="easy-read"?"easy-read":"default";const m=localStorage.getItem("ss-motion")==="reduced";const c=navigator.connection&&navigator.connection.saveData;r.dataset.motion=m||matchMedia("(prefers-reduced-motion: reduce)").matches||c?"reduced":"auto";r.dataset.motionPreference=m?"reduced":"auto";for(const k of Object.keys(localStorage)){if(/con.trast/i.test(k))localStorage.removeItem(k)}}catch{}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-NG" suppressHydrationWarning className={`${displayFont.variable} ${uiFont.variable} ${easyReadFont.variable}`}>
    <head><script dangerouslySetInnerHTML={{ __html: themeInit }}/></head>
    <body><SiteShell>{children}</SiteShell></body>
  </html>;
}
