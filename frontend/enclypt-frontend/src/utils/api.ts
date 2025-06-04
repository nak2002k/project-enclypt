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
  "/dashboard/key",  // ← add this
  "/dashboard/json",
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
  timeoutMs = 30000,
}: RequestOptions): Promise<T> {
  const url = buildUrl(path);

  const headers: Record<string, string> = { Accept: "application/json" };
  let body: string | undefined;

  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, { method, headers, body, signal: controller.signal });
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === "AbortError") throw new Error("Request timed out");
    throw new Error("Network error");
  } finally {
    clearTimeout(id);
  }

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      if (json.detail) message = json.detail;
    } catch {}
    throw new Error(message);
  }

  const contentType = res.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  // @ts-ignore
  return res.blob();
}

// convenience wrappers
export function postJSON<T = any>(
  path: string,
  data?: unknown,
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

// our dashboard helpers
export interface DashboardFile {
  filename: string;
  size: number;
  method: string;
  timestamp: string;
}

export interface DashboardData {
  email: string;
  tier: string;
  files: DashboardFile[];
}

export function getDashboard(token: string): Promise<DashboardData> {
  return getJSON<DashboardData>("/dashboard", token);
}

export function getLicenseKey(token: string): Promise<{ license_key: string }> {
  return getJSON<{ license_key: string }>("/dashboard/key", token);
}

export function getDashboardJson(
  token: string
): Promise<{ files: DashboardFile[] }> {
  return getJSON<{ files: DashboardFile[] }>("/dashboard/json", token);
}
export async function postFile(
  path: string,
  formData: FormData,
  token?: string,
  timeoutMs = 30000
): Promise<Blob> {
  const url = buildUrl(path)

  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    })
  } catch (err: any) {
    clearTimeout(id)
    if (err.name === "AbortError") throw new Error("Request timed out")
    throw new Error("Network error")
  } finally {
    clearTimeout(id)
  }

  if (!res.ok) {
    const text = await res.text()
    let message = text
    try {
      const json = JSON.parse(text)
      if (json.detail) message = json.detail
    } catch {}
    throw new Error(message)
  }

  return res.blob()
}

