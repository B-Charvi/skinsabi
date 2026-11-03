type IllustrationName = "hero-products" | "check-label" | "patch-test" | "watch-skin";

type IllustrationProps = {
  name: IllustrationName;
  className?: string;
};

function HeroProducts({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 300 380" role="img" aria-label="Skincare bottles and leaves in an arch" focusable="false">
    <clipPath id="hr-arch"><path d="M10 380 V148 A140 140 0 0 1 290 148 V380 Z"/></clipPath>
    <path className="ss-frame" d="M10 380 V148 A140 140 0 0 1 290 148 V380 Z" fill="var(--illus-frame, #DDEFE3)"/>
    <g clipPath="url(#hr-arch)">
      <circle className="ss-sun" cx="212" cy="124" r="46" fill="#F2C14E"/>
      <g className="ss-leaves">
        <path d="M58 380 C62 300 70 220 96 150" stroke="#2A8058" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M0 0 C6 -18 24 -26 40 -22 C38 -4 22 10 0 0 Z" fill="#2A8058" transform="translate(62 330) rotate(-30) scale(1.1)"/>
        <path d="M0 0 C6 -18 24 -26 40 -22 C38 -4 22 10 0 0 Z" fill="#3E9B6D" transform="translate(64 300) rotate(-150) scale(1)"/>
        <path d="M0 0 C6 -18 24 -26 40 -22 C38 -4 22 10 0 0 Z" fill="#2A8058" transform="translate(70 262) rotate(-28) scale(1)"/>
        <path d="M0 0 C6 -18 24 -26 40 -22 C38 -4 22 10 0 0 Z" fill="#3E9B6D" transform="translate(74 232) rotate(-152) scale(0.95)"/>
        <path d="M0 0 C6 -18 24 -26 40 -22 C38 -4 22 10 0 0 Z" fill="#2A8058" transform="translate(82 200) rotate(-26) scale(0.9)"/>
        <path d="M0 0 C6 -18 24 -26 40 -22 C38 -4 22 10 0 0 Z" fill="#8FD3B0" transform="translate(88 172) rotate(-150) scale(0.85)"/>
        <path d="M0 0 C6 -18 24 -26 40 -22 C38 -4 22 10 0 0 Z" fill="#3E9B6D" transform="translate(96 150) rotate(-60) scale(0.8)"/>
      </g>
      <path d="M20 344 Q150 322 280 344 L280 380 L20 380 Z" fill="#C5E0D0"/>
      <ellipse cx="150" cy="346" rx="74" ry="7" fill="#0F3D2E" opacity=".16"/><ellipse cx="228" cy="346" rx="44" ry="6" fill="#0F3D2E" opacity=".14"/><ellipse cx="84" cy="346" rx="34" ry="5" fill="#0F3D2E" opacity=".14"/>
      <g className="ss-tube" transform="rotate(-7 84 300)"><rect x="62" y="262" width="44" height="82" rx="16" fill="#8FD3B0"/><rect x="62" y="262" width="44" height="26" rx="12" fill="#FF8C5A"/><rect x="70" y="300" width="28" height="26" rx="8" fill="#FFF8F0"/><path d="M76 310 h16 M76 318 h10" stroke="#2A8058" strokeWidth="3.5" strokeLinecap="round"/><rect x="68" y="270" width="6" height="64" rx="3" fill="#FFFFFF" opacity=".28"/></g>
      <g className="ss-bottle"><rect x="144" y="124" width="22" height="48" rx="11" fill="#FF6B35"/><rect x="134" y="166" width="42" height="14" rx="6" fill="#E9B44C"/><rect x="140" y="178" width="30" height="22" rx="6" fill="#0F3D2E"/><rect x="118" y="192" width="74" height="152" rx="26" fill="#0F3D2E"/><rect x="130" y="234" width="50" height="66" rx="10" fill="#FFF8F0"/><path d="M139 250 h32 M139 262 h24 M139 274 h28" stroke="#2A8058" strokeWidth="4" strokeLinecap="round"/><rect x="126" y="206" width="7" height="122" rx="3.5" fill="#FFFFFF" opacity=".16"/></g>
      <g className="ss-jar"><rect x="194" y="284" width="68" height="60" rx="18" fill="#FFF8F0"/><rect x="190" y="266" width="76" height="26" rx="10" fill="#2A8058"/><path d="M204 312 h48" stroke="#8FD3B0" strokeWidth="7" strokeLinecap="round"/><path d="M210 326 h36" stroke="#CFE7D8" strokeWidth="6" strokeLinecap="round"/><rect x="200" y="272" width="6" height="14" rx="3" fill="#FFFFFF" opacity=".25"/></g>
      <circle cx="40" cy="120" r="5" fill="#E9B44C"/><circle cx="258" cy="214" r="5" fill="#8FD3B0"/><circle cx="150" cy="86" r="4" fill="#FF8C5A"/>
    </g>
  </svg>;
}

function CheckLabel({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 320 260" role="img" aria-label="A bottle with a label, a magnifying glass over the ingredients and three flags: red, yellow and green" focusable="false">
    <path className="ss-frame" d="M34 140 C26 66 98 22 168 28 C246 34 300 78 294 148 C288 212 232 242 160 240 C90 238 42 212 34 140 Z" fill="var(--illus-frame, #DDEFE3)"/>
    <path d="M0 0c3-12 14-18 26-16-1 12-12 20-26 16Z" fill="#2A8058" transform="translate(48 70) rotate(-20) scale(0.9)"/><path d="M0 0c3-12 14-18 26-16-1 12-12 20-26 16Z" fill="#2A8058" transform="translate(262 214) rotate(160) scale(0.8)"/><circle cx="66" cy="196" r="5" fill="#8FD3B0"/><circle cx="280" cy="50" r="6" fill="#E9B44C"/>
    <g className="ss-product"><rect x="96" y="54" width="52" height="36" rx="10" fill="#0F3D2E"/><rect x="74" y="86" width="96" height="140" rx="26" fill="#FFF8F0"/><rect x="86" y="112" width="72" height="92" rx="14" fill="#E3F1E8"/><path d="M94 130 h34" stroke="#0F3D2E" strokeWidth="6" strokeLinecap="round" fill="none"/><path d="M94 146 h50" stroke="#2A8058" strokeWidth="6" strokeLinecap="round" fill="none"/><path d="M94 160 h36" stroke="#9BC9AE" strokeWidth="6" strokeLinecap="round" fill="none"/><path d="M94 174 h46" stroke="#2A8058" strokeWidth="6" strokeLinecap="round" fill="none"/><path d="M94 188 h30" stroke="#9BC9AE" strokeWidth="6" strokeLinecap="round" fill="none"/></g>
    <g className="ss-magnifier"><circle cx="150" cy="158" r="32" fill="#FFFFFF" fillOpacity=".5" stroke="#0F3D2E" strokeWidth="9"/><path d="M128 150 Q132 140 143 136" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none"/><path d="M174 182 L202 210" stroke="#FF8C5A" strokeWidth="13" strokeLinecap="round"/></g>
    <g className="ss-flags"><g className="ss-flag ss-flag-1" style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx="256" cy="84" r="21" fill="#D9453D"/><path d="M247 75 L265 93 M265 75 L247 93" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round"/></g><g className="ss-flag ss-flag-2" style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx="262" cy="134" r="21" fill="#F2B52E"/><path d="M262 123 L273 143 L251 143 Z" fill="#3A2A00" stroke="#3A2A00" strokeWidth="3" strokeLinejoin="round"/><rect x="260.8" y="130" width="2.6" height="7" rx="1.3" fill="#F2B52E"/><circle cx="262.1" cy="140.2" r="1.5" fill="#F2B52E"/></g><g className="ss-flag ss-flag-3" style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx="256" cy="184" r="21" fill="#2A8058"/><path d="M246 185 L253 192 L267 176" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></g></g>
  </svg>;
}

function PatchTest({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 320 260" role="img" aria-label="A round patch on a forearm and a clock, showing a patch test waiting period" focusable="false">
    <clipPath id="pt-blob"><path d="M34 140 C26 66 98 22 168 28 C246 34 300 78 294 148 C288 212 232 242 160 240 C90 238 42 212 34 140 Z"/></clipPath>
    <path className="ss-frame" d="M34 140 C26 66 98 22 168 28 C246 34 300 78 294 148 C288 212 232 242 160 240 C90 238 42 212 34 140 Z" fill="var(--illus-frame, #DDEFE3)"/>
    <path d="M0 0c3-12 14-18 26-16-1 12-12 20-26 16Z" fill="#2A8058" transform="translate(52 66) rotate(-20) scale(0.9)"/><path d="M0 0c3-12 14-18 26-16-1 12-12 20-26 16Z" fill="#2A8058" transform="translate(270 218) rotate(160) scale(0.8)"/><circle cx="62" cy="206" r="5" fill="#8FD3B0"/><circle cx="284" cy="52" r="6" fill="#E9B44C"/>
    <clipPath id="pt-skin"><circle cx="138" cy="150" r="86"/></clipPath><circle cx="138" cy="150" r="86" fill="var(--ss-skin, #A86B43)"/><g clipPath="url(#pt-skin)"><ellipse cx="108" cy="104" rx="62" ry="34" fill="#FFFFFF" opacity=".16" transform="rotate(-24 108 104)"/><ellipse cx="160" cy="246" rx="120" ry="64" fill="#000" opacity=".13"/></g>
    <g className="ss-spot"><circle cx="138" cy="150" r="24" fill="#FFF8F0"/><circle cx="138" cy="150" r="24" fill="none" stroke="#E3CBB5" strokeWidth="3"/><circle cx="130" cy="142" r="2.8" fill="#E3CBB5"/><circle cx="146" cy="156" r="2.8" fill="#E3CBB5"/><circle cx="147" cy="140" r="2.4" fill="#E3CBB5"/><circle cx="129" cy="159" r="2.4" fill="#E3CBB5"/></g>
    <circle className="ss-spot-ring" cx="138" cy="150" r="36" fill="none" stroke="#FF6B35" strokeWidth="5" style={{ transformBox: "fill-box", transformOrigin: "center" }}/>
    <g className="ss-clock"><circle cx="248" cy="86" r="34" fill="#FFF8F0"/><circle cx="248" cy="86" r="34" fill="none" stroke="#0F3D2E" strokeWidth="7"/><path d="M248 86 L248 66" stroke="#0F3D2E" strokeWidth="5" strokeLinecap="round"/><g className="ss-clock-hand" style={{ transformBox: "view-box", transformOrigin: "248px 86px" }}><path d="M248 86 L266 96" stroke="#FF6B35" strokeWidth="5" strokeLinecap="round"/></g><circle cx="248" cy="86" r="4.5" fill="#0F3D2E"/></g>
  </svg>;
}

function WatchSkin({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 320 260" role="img" aria-label="A calendar showing fourteen days, with days one, three, seven and fourteen marked, and a green check" focusable="false">
    <path className="ss-frame" d="M34 140 C26 66 98 22 168 28 C246 34 300 78 294 148 C288 212 232 242 160 240 C90 238 42 212 34 140 Z" fill="var(--illus-frame, #DDEFE3)"/>
    <path d="M0 0c3-12 14-18 26-16-1 12-12 20-26 16Z" fill="#2A8058" transform="translate(50 76) rotate(-25) scale(0.9)"/><circle cx="280" cy="70" r="6" fill="#E9B44C"/><circle cx="60" cy="210" r="5" fill="#8FD3B0"/><path d="M0 0c3-12 14-18 26-16-1 12-12 20-26 16Z" fill="#2A8058" transform="translate(290 150) rotate(-30) scale(0.8)"/>
    <rect x="86" y="74" width="160" height="150" rx="24" fill="#BCD8C6"/><rect x="80" y="64" width="160" height="150" rx="24" fill="#FFF8F0"/><path d="M80 88 a24 24 0 0 1 24 -24 h112 a24 24 0 0 1 24 24 v20 h-160 Z" fill="#0F3D2E"/><rect x="112" y="52" width="14" height="28" rx="7" fill="#FF8C5A"/><rect x="194" y="52" width="14" height="28" rx="7" fill="#FF8C5A"/>
    <circle cx="100" cy="138" r="7.4" fill="#2A8058"/><circle cx="120" cy="138" r="7.4" fill="#CFE7D8"/><circle cx="140" cy="138" r="7.4" fill="#2A8058"/><circle cx="160" cy="138" r="7.4" fill="#CFE7D8"/><circle cx="180" cy="138" r="7.4" fill="#CFE7D8"/><circle cx="200" cy="138" r="7.4" fill="#CFE7D8"/><circle cx="220" cy="138" r="7.4" fill="#2A8058"/><circle cx="100" cy="166" r="7.4" fill="#CFE7D8"/><circle cx="120" cy="166" r="7.4" fill="#CFE7D8"/><circle cx="140" cy="166" r="7.4" fill="#CFE7D8"/><circle cx="160" cy="166" r="7.4" fill="#CFE7D8"/><circle cx="180" cy="166" r="7.4" fill="#CFE7D8"/><circle cx="200" cy="166" r="7.4" fill="#CFE7D8"/><circle cx="220" cy="166" r="7.4" fill="#FF6B35"/>
    <path d="M96 192 h60" stroke="#CFE7D8" strokeWidth="6" strokeLinecap="round" fill="none"/><g className="ss-badge" style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx="236" cy="208" r="30" fill="#2A8058"/><path className="ss-check" pathLength={1} d="M222 210 L232 220 L251 197" stroke="#FFFFFF" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ strokeDasharray: "1", strokeDashoffset: "0" }}/></g><rect className="ss-page" x="80" y="64" width="160" height="150" rx="24" fill="#FFF8F0" style={{ transformBox: "fill-box", transformOrigin: "50% 0", transform: "scaleY(0)" }}/>
  </svg>;
}

export function Illustration({ name, className = "" }: IllustrationProps) {
  switch (name) {
    case "hero-products": return <HeroProducts className={className}/>;
    case "check-label": return <CheckLabel className={className}/>;
    case "patch-test": return <PatchTest className={className}/>;
    case "watch-skin": return <WatchSkin className={className}/>;
  }
}
