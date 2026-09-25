const SCRIPT_RE = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const EVENT_RE = /\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi;
const JS_URL_RE = /\s(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi;

/** Lightweight HTML sanitize for blog bodies (no jsdom — safe on Vercel). */
export function sanitizeBlogHtml(html: string) {
  return html
    .replace(SCRIPT_RE, "")
    .replace(EVENT_RE, "")
    .replace(JS_URL_RE, "");
}

export function asFaqItems(value: unknown): Array<{ question: string; answer: string }> {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is { question: string; answer: string } =>
      !!item &&
      typeof item === "object" &&
      typeof (item as { question?: unknown }).question === "string" &&
      typeof (item as { answer?: unknown }).answer === "string",
  );
}
