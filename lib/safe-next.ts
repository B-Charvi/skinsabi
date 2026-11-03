/** Only allow same-site paths after login. Anything else becomes the fallback. */
export function safeNext(raw: string | null | undefined, fallback = "/"): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || raw.includes(":")) return fallback;
  return raw;
}

/** Read ?next= from the address bar. Call only in the browser (an effect or an event handler). */
export function nextFromLocation(fallback = "/"): string {
  try { return safeNext(new URLSearchParams(window.location.search).get("next"), fallback); } catch { return fallback; }
}

/** Match a stored value to one of the known option strings, ignoring case ("I Don't Know" and "I don't know"). */
export function matchOption(value: string | null | undefined, options: readonly string[]): string {
  const wanted = (value ?? "").trim().toLowerCase();
  return options.find(option => option.toLowerCase() === wanted) ?? "";
}
