export type SkinTone = "deep" | "medium-deep" | "medium" | "light" | "fair";
export type CharacterStyle = "natural" | "hijab" | "sun-hat";

const skinTones: Record<SkinTone, string> = {
  deep: "var(--skin-tone-deep)",
  "medium-deep": "var(--skin-tone-medium-deep)",
  medium: "var(--skin-tone-medium)",
  light: "var(--skin-tone-light)",
  fair: "var(--skin-tone-fair)",
};

export function PortraitIllustration({ tone = "medium", style = "natural", className = "" }: { tone?: SkinTone; style?: CharacterStyle; className?: string }) {
  const skin = skinTones[tone];
  const isHijab = style === "hijab";
  const isSunHat = style === "sun-hat";

  return <svg className={className} viewBox="0 0 480 470" role="img" aria-label={`${tone} skin portrait illustration`} focusable="false">
    <circle cx="350" cy="126" r="84" fill="var(--color-accent-soft)"/>
    <path d="M55 470c12-100 74-158 185-158s173 58 185 158H55Z" fill="var(--color-brand-deep)"/>
    <path d="M201 289h78v79h-78z" fill={skin}/>
    {isHijab && <path d="M122 208c-8-103 37-168 118-168 80 0 122 65 116 166l-16 144c-26-34-60-52-101-52-45 0-82 19-108 55l-9-145Z" fill="var(--color-hijab)"/>}
    {isSunHat && <path d="M90 141c18-68 70-104 150-104s131 36 150 104l32 18H58l32-18Zm84 20h132c-2 86-26 136-66 136s-64-50-66-136Z" fill="var(--color-hat)"/>}
    {!isHijab && !isSunHat && <path d="M137 180c-8-83 27-143 103-143 80 0 120 54 109 146-9-18-20-34-35-49-36 30-91 46-164 44l-13 2Z" fill="var(--color-hair)"/>}
    <path d="M150 169c0-79 38-126 95-126 62 0 94 48 94 126v63c0 64-41 112-95 112s-94-48-94-112v-63Z" fill={skin}/>
    {isHijab && <path d="M138 195c5-85 42-137 109-137 64 0 102 51 105 136-17-18-32-40-43-65-46 30-101 45-171 42v24Z" fill="var(--color-hijab)"/>}
    {isSunHat && <path d="M124 149c19-63 65-93 133-93s114 30 133 93H124Z" fill="var(--color-hat)"/>}
    {!isSunHat && <>
      <path d="M184 199c14-9 28-10 41-4m41 0c14-7 28-6 41 3" fill="none" stroke="var(--color-ink-soft)" strokeWidth="6" strokeLinecap="round"/>
      {isHijab ? <><ellipse cx="205" cy="216" rx="5" ry="7" fill="var(--color-ink-soft)"/><ellipse cx="286" cy="216" rx="5" ry="7" fill="var(--color-ink-soft)"/></> : <><path d="M203 211v4m85-4v4" stroke="var(--color-ink-soft)" strokeWidth="5" strokeLinecap="round"/></>}
      <path d="M242 219c-3 18-7 34-12 48 8 5 16 5 24 1" fill="none" stroke="var(--color-skin-line)" strokeWidth="5" strokeLinecap="round"/>
      <path d="M215 282c18 11 38 11 56-1" fill="none" stroke="var(--color-skin-line)" strokeWidth="6" strokeLinecap="round"/>
    </>}
    {isSunHat && <><path d="M173 179h58v27h-58zm80 0h58v27h-58z" fill="var(--color-sunglasses)"/><path d="M231 190h22" stroke="var(--color-sunglasses)" strokeWidth="6"/></>}
    {isHijab && <path d="M138 197c-3 103 7 156 35 186 20-26 43-41 68-45-55-17-83-64-103-141Z" fill="var(--color-hijab-shadow)"/>}
    <path d="M124 427c28-43 66-64 116-64 48 0 87 21 116 64" fill="none" stroke="var(--color-leaf)" strokeWidth="4" strokeLinecap="round"/>
  </svg>;
}

export function SceneIllustration({ scene, className = "" }: { scene: "label" | "patch-test" | "watch"; className?: string }) {
  return <svg className={className} viewBox="0 0 160 130" aria-hidden="true" focusable="false">
    <path d="M18 104c17-17 34-25 61-25s48 8 64 25" fill="none" stroke="var(--color-leaf)" strokeWidth="3" strokeLinecap="round"/>
    {scene === "label" && <>
      <rect x="35" y="30" width="73" height="57" rx="8" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="3"/>
      <path d="M49 46h43M49 58h33M49 70h23" stroke="var(--color-text-muted)" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="102" cy="76" r="22" fill="var(--color-surface-2)" stroke="var(--color-cta-ink)" strokeWidth="4"/>
      <path d="m118 92 17 17" stroke="var(--color-cta-ink)" strokeWidth="6" strokeLinecap="round"/>
    </>}
    {scene === "patch-test" && <>
      <path d="M58 18c27-6 48 11 51 38-1 27-17 47-36 51-22-2-40-20-41-45 1-22 9-37 26-44Z" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="3"/>
      <circle cx="101" cy="57" r="8" fill="var(--color-cta)"/>
      <path d="M27 100c16-10 29-12 42-7" fill="none" stroke="var(--color-skin-line)" strokeWidth="4" strokeLinecap="round"/>
    </>}
    {scene === "watch" && <>
      <rect x="44" y="22" width="73" height="83" rx="12" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="3"/>
      <path d="M44 47h73M62 17v14m37-14v14" stroke="var(--color-brand)" strokeWidth="4" strokeLinecap="round"/>
      <path d="m65 76 10 9 21-23" fill="none" stroke="var(--color-leaf)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </>}
  </svg>;
}
