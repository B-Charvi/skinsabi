"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
const nav = [["Home","/"],["My Products","/products"],["Routine","/routine"],["Learn","/learn"],["Test & Watch","/test-and-watch"],["Reviews","/reviews"],["Find a Doctor","/find-a-dermatologist"]];
export function SiteShell({ children }: { children: React.ReactNode }) {
 const [theme,setTheme]=useState("light"),[size,setSize]=useState(16),[contrast,setContrast]=useState(false);
 useEffect(()=>{const t=localStorage.getItem("ss-theme")||"light",s=Number(localStorage.getItem("ss-size")||16),c=localStorage.getItem("ss-contrast")==="true";setTheme(t);setSize(s);setContrast(c);document.documentElement.style.fontSize=`${s}px`;document.documentElement.dataset.theme=t;document.documentElement.dataset.contrast=c?"high":"normal";},[]);
 function font(n:number){setSize(n);localStorage.setItem("ss-size",String(n));document.documentElement.style.fontSize=`${n}px`;}
 function mode(){const n=theme==="dark"?"light":"dark";setTheme(n);localStorage.setItem("ss-theme",n);document.documentElement.dataset.theme=n;}
 function hc(){const n=!contrast;setContrast(n);localStorage.setItem("ss-contrast",String(n));document.documentElement.dataset.contrast=n?"high":"normal";}
 return <><header className="nav"><div className="nav-inner"><Link className="brand" href="/">SkinSabi</Link><nav className="links">{nav.map(([name,url])=><Link key={url} href={url}>{name}</Link>)}</nav><div className="tools"><button aria-label="Decrease text" onClick={()=>font(Math.max(14,size-2))}>A−</button><button aria-label="Default text" onClick={()=>font(16)}>A</button><button aria-label="Increase text" onClick={()=>font(Math.min(22,size+2))}>A+</button><button onClick={mode}>{theme==="dark"?"☀ Light":"☾ Dark"}</button><button onClick={hc}>Contrast</button><a href="/login">Profile</a></div></div></header><main className="shell">{children}</main><footer><div className="shell"><strong>SkinSabi: Your skin sabi pass.</strong><p>General skincare education, not medical advice. Your skin knows best.</p><div className="row"><Link href="/learn">Learn</Link><Link href="/find-a-dermatologist">Dermatologist directory</Link><Link href="/privacy">Privacy</Link></div></div></footer></>;
}


