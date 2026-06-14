const BASE_URL = "https://jsonplaceholder.typicode.com";
const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  
  ...{},
};

async function request<T = any>(method: string, path: string, body?: any): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: DEFAULT_HEADERS,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.json();
}

export const jsonplaceholder = {
  get: <T = any>(path: string, body?: any) => request<T>("GET", path, body),
  post: <T = any>(path: string, body?: any) => request<T>("POST", path, body),
  put: <T = any>(path: string, body?: any) => request<T>("PUT", path, body),
  patch: <T = any>(path: string, body?: any) => request<T>("PATCH", path, body),
  del: <T = any>(path: string, body?: any) => request<T>("DELETE", path, body),
};
