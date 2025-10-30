const BASE_URL = process.env.REACT_APP_API_BASE_URL!;

function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');

  // JSON по умолчанию (кроме multipart)
  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  // Bearer, если есть токен
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      message = JSON.stringify(data);
    } catch {}
    throw new Error(message);
  }

  // 204 / пустой ответ
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const httpGet = <T>(path: string) => http<T>(path);
export const httpPost = <T>(path: string, body?: any) =>
  http<T>(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) });
export const httpPut = <T>(path: string, body?: any) =>
  http<T>(path, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) });
export const httpDel = <T>(path: string) => http<T>(path, { method: 'DELETE' });
