import { httpPost } from './http';

// DTO из Swagger
type JwtCreateReq = { email: string; password: string };
type JwtCreateRes = { access: string; refresh: string };
type JwtRefreshReq = { refresh: string };
type JwtRefreshRes = { access: string };
type JwtVerifyReq = { token: string };
type JwtVerifyRes = Record<string, unknown>;

export async function signIn(data: JwtCreateReq) {
  const res = await httpPost<JwtCreateRes>('/auth/jwt/create/', data);
  localStorage.setItem('accessToken', res.access);
  localStorage.setItem('refreshToken', res.refresh);
  return res;
}

export async function refreshToken() {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) throw new Error('No refresh token');
  const res = await httpPost<JwtRefreshRes>('/auth/jwt/refresh/', { refresh } as JwtRefreshReq);
  localStorage.setItem('accessToken', res.access);
  return res.access;
}

export async function verifyToken(token: string) {
  return httpPost<JwtVerifyRes>('/auth/jwt/verify/', { token } as JwtVerifyReq);
}

export function signOut() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
