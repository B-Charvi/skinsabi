/**
 * Decorative floating leaves and flowers for the open pages (Home, Login, Signup, Learn).
 * Put it inside a wrapper with class "ambient-host". It is hidden from screen readers, never takes clicks,
 * and only moves when the Motion setting allows it (see the .ss-sprite rules in globals.css).
 */
type Sprite = {
  kind: "leaf" | "flower";
  top: string; left?: string; right?: string; size: number;
  r0: number; r1: number; dx: number; dur: number; delay: number; mobile: boolean;
};

const sprites: Sprite[] = [
  { kind: "leaf", top: "6%", left: "2%", size: 44, r0: -18, r1: -4, dx: 10, dur: 11, delay: -2, mobile: true },
  { kind: "flower", top: "14%", right: "3%", size: 52, r0: 0, r1: 14, dx: -8, dur: 13, delay: -5, mobile: true },
  { kind: "leaf", top: "46%", right: "1%", size: 36, r0: 24, r1: 8, dx: -10, dur: 10, delay: -7, mobile: false },
  { kind: "leaf", top: "72%", left: "1%", size: 40, r0: -30, r1: -12, dx: 12, dur: 12, delay: -3, mobile: false },
  { kind: "flower", top: "84%", right: "6%", size: 34, r0: 8, r1: -8, dx: -6, dur: 9, delay: -1, mobile: true },
  { kind: "leaf", top: "30%", left: "6%", size: 28, r0: 12, r1: 28, dx: 8, dur: 14, delay: -9, mobile: false },
  { kind: "leaf", top: "58%", right: "9%", size: 30, r0: -10, r1: 6, dx: -9, dur: 11, delay: -4, mobile: false },
];

const leafPath = "M0 0C9 -10 9 -30 0 -42C-9 -30 -9 -10 0 0Z";

function Shape({ kind }: { kind: Sprite["kind"] }) {
  if (kind === "leaf") return <path d={leafPath} transform="translate(0 22)"/>;
  return <g transform="translate(0 0)">
    {[0, 72, 144, 216, 288].map(angle => <ellipse key={angle} cx="0" cy="-9" rx="5" ry="9" transform={`rotate(${angle})`}/>)}
    <circle cx="0" cy="0" r="3.4"/>
  </g>;
}

export function AmbientSprites({ side = "both" }: { side?: "both" | "right" }) {
  const shown = side === "right" ? sprites.filter(sprite => sprite.right !== undefined) : sprites;
  return <div className="ss-sprites" aria-hidden="true">
    {shown.map((sprite, index) => <svg
      key={index}
      className={`ss-sprite${sprite.mobile ? "" : " ss-sprite--wide"}`}
      viewBox="-24 -24 48 48"
      width={sprite.size}
      height={sprite.size}
      fill="currentColor"
      focusable="false"
      style={{
        top: sprite.top, left: sprite.left, right: sprite.right,
        ["--r0" as string]: `${sprite.r0}deg`, ["--r1" as string]: `${sprite.r1}deg`, ["--dx" as string]: `${sprite.dx}px`,
        ["--dur" as string]: `${sprite.dur}s`, ["--delay" as string]: `${sprite.delay}s`,
      }}
    ><Shape kind={sprite.kind}/></svg>)}
  </div>;
}
