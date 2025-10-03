const BASE = "https://api.spaceflightnewsapi.net/v4";

export async function get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const qs = params ? "?" + new URLSearchParams(params as any).toString(): "";
    const res = await fetch(`${BASE}${path}${qs}`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json() as Promise<T>;
}