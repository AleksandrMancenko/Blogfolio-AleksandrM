const isLocal =
  typeof window !== "undefined" &&
  /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

const BASE = isLocal ? "" : "https://studapi.teachmeskills.by";

function normalizePath(p: string) {
  if (p.startsWith("/posts/")) {
    if (typeof console !== "undefined") console.warn(`[student.ts] Fixed path "/posts/..." → "/blog${p}"`);
    return `/blog${p}`;
  }
  return p;
}

export async function get<T>(
  path: string,
  params?: Record<string, string | number>
): Promise<T> {
  const qs = params ? `?${new URLSearchParams(params as any)}` : "";
  const norm = normalizePath(path);
  const res = await fetch(`${BASE}${norm}${qs}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function getAbs<T>(absUrl: string): Promise<T> {
  const url =
    isLocal && absUrl.startsWith("https://studapi.teachmeskills.by")
      ? absUrl.replace("https://studapi.teachmeskills.by", "")
      : absUrl;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
