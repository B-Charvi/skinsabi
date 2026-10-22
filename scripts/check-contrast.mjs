import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const themeBlocks = [
  { name: "Light", selector: /:root\s*\{([^}]*)\}/ },
  { name: "Dark", selector: /:root\[data-theme="dark"\]\s*\{([^}]*)\}/ },
];
const pairs = [
  ["Body text / page", "color-text", "color-bg", 4.5],
  ["Body text / surface", "color-text", "color-surface", 4.5],
  ["Body text / tinted surface", "color-text", "color-surface-2", 4.5],
  ["Muted text / page", "color-text-muted", "color-bg", 4.5],
  ["Muted text / surface", "color-text-muted", "color-surface", 4.5],
  ["Muted text / tinted surface", "color-text-muted", "color-surface-2", 4.5],
  ["Brand text / page", "color-brand", "color-bg", 4.5],
  ["Brand text / surface", "color-brand", "color-surface", 4.5],
  ["Brand text / tinted surface", "color-brand", "color-surface-2", 4.5],
  ["Text on brand control", "color-on-brand", "color-brand", 4.5],
  ["Text on action control", "color-on-cta", "color-cta", 4.5],
  ["Action link / page", "color-cta-ink", "color-bg", 4.5],
  ["Action link / surface", "color-cta-ink", "color-surface", 4.5],
  ["Placeholder / input", "color-placeholder", "color-surface", 4.5],
  ["Red flag / status fill", "color-danger", "color-danger-bg", 4.5],
  ["Yellow flag / status fill", "color-warning", "color-warning-bg", 4.5],
  ["Green flag / status fill", "color-success", "color-success-bg", 4.5],
  ["Disclaimer / fill", "color-disclaimer-text", "color-disclaimer-bg", 4.5],
  ["Disclaimer border / fill", "color-disclaimer-border", "color-disclaimer-bg", 3],
  ["Brand panel text / fill", "color-brand-deep-ink", "color-brand-deep", 4.5],
  ["Focus / page", "color-focus", "color-bg", 3],
  ["Focus / surface", "color-focus", "color-surface", 3],
  ["Strong border / surface", "color-border-strong", "color-surface", 3],
  ["Leaf mark / page", "color-leaf", "color-bg", 3],
];

function parseTokens(block) {
  const tokens = new Map();
  for (const [, name, value] of block.matchAll(/--([\w-]+)\s*:\s*(#[\da-f]{6})\s*;/gi)) tokens.set(name, value);
  return tokens;
}

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map(part => parseInt(part, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(foreground, background) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

let failed = false;
for (const theme of themeBlocks) {
  const match = css.match(theme.selector);
  if (!match) throw new Error(`Could not locate ${theme.name} token block in app/globals.css`);
  const tokens = parseTokens(match[1]);
  process.stdout.write(`\n${theme.name} theme\n`);
  for (const [label, foregroundName, backgroundName, minimum] of pairs) {
    const foreground = tokens.get(foregroundName);
    const background = tokens.get(backgroundName);
    if (!foreground || !background) throw new Error(`Missing color token: ${foregroundName} or ${backgroundName}`);
    const value = ratio(foreground, background);
    const status = value >= minimum ? "PASS" : "FAIL";
    if (status === "FAIL") failed = true;
    process.stdout.write(`${status} ${value.toFixed(2)}:1 (min ${minimum}:1) — ${label}\n`);
  }
}

if (failed) process.exitCode = 1;
