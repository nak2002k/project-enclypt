// src/utils/api.ts

// 1) Set your API base URL via env (Vite: import.meta.env)
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

// 2) Whitelist your endpoints to block surprises
const ALLOWED_PATHS = new Set([
  "/register",
  "/token",
  "/encrypt",
  "/decrypt",
  "/dashboard",
  "/dashboard/key",
]);

function buildUrl(path: string): string {
  if (!ALLOWED_PATHS.has(path)) {
    throw new Error(`Invalid API path: ${path}`);
  }
  return `${API_BASE_URL}${path}`;
}

interface RequestOptions {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  token?: string;
  timeoutMs?: number;
}

async function apiRequest<T = any>({
  path,
  method = "POST",
  data,
  token,
  timeoutMs = 30000, // 30s default
}: RequestOptions): Promise<T> {
  const url = buildUrl(path);

  // 3) Build headers
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  let body: string | undefined;
  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
    // JSON.stringify is safe against injection
    body = JSON.stringify(data);
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 4) Setup timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body,
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw new Error("Network error");
  } finally {
    clearTimeout(id);
  }

  // 5) Handle HTTP errors
  if (!res.ok) {
    const text = await res.text();
    // try parse JSON { detail: "..." }
    let message = text;
    try {
      const json = JSON.parse(text);
      if (json.detail) message = json.detail;
    } catch {}
    throw new Error(message);
  }

  // 6) Parse response
  const contentType = res.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }
  // fallback (e.g. file download)
  // @ts-ignore
  return await res.blob();
}

// 7) Convenience wrappers
export function postJSON<T = any>(
  path: string,
  data: unknown,
  token?: string
): Promise<T> {
  return apiRequest<T>({ path, data, token, method: "POST" });
}

export function getJSON<T = any>(
  path: string,
  token?: string
): Promise<T> {
  return apiRequest<T>({ path, token, method: "GET" });
}
