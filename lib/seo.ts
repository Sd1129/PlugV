export const SITE_NAME = "PlugV.in";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://plugv.in"
).replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
