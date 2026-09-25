const SCRIPT_RE = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const EVENT_RE = /\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi;
const JS_URL_RE = /\s(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi;

export function sanitizeHtml(html: string) {
  return html
    .replace(SCRIPT_RE, "")
    .replace(EVENT_RE, "")
    .replace(JS_URL_RE, "");
}
