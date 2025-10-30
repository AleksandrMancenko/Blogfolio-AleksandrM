import { httpPost } from './http';

const BASE =
  typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)
    ? ''
    : 'https://studapi.teachmeskills.by';

// DTO из Swagger
type JwtCreateReq = { email: string; password: string };
type JwtCreateRes = { access: string; refresh: string };
type JwtRefreshReq = { refresh: string };
type JwtRefreshRes = { access: string };
type JwtVerifyReq = { token: string };
type JwtVerifyRes = Record<string, unknown>;

// Registration types
type RegisterReq = { email: string; username: string; password: string };
type RegisterRes = { email: string; username: string };

// Activation types
// kept for docs, not used directly
// type ActivationReq = { uid: string; token: string };
type ActivationRes = Record<string, unknown>;

export async function signIn(data: JwtCreateReq) {
  const url = `${BASE}/auth/jwt/create/`;
  console.log('Signing in to:', url, { email: data.email });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Sign in response status:', res.status);

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
      console.log('Sign in error:', error);
    } catch {
      error = { message: res.statusText };
    }
    throw new Error(JSON.stringify(error));
  }

  const result = await res.json();
  console.log('Sign in success:', result);
  localStorage.setItem('accessToken', result.access);
  localStorage.setItem('refreshToken', result.refresh);
  return result as Promise<JwtCreateRes>;
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

export async function registerUser(data: RegisterReq) {
  const url = `${BASE}/auth/users/`;
  console.log('Registering user to:', url, data);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Registration response status:', res.status);

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
      console.log('Registration error:', error);
    } catch {
      error = { message: res.statusText };
    }
    // Возвращаем объект ошибки для более детальной обработки
    const errorMessage =
      typeof error === 'object' && error !== null ? JSON.stringify(error) : String(error);
    throw new Error(errorMessage);
  }

  const result = await res.json();
  console.log('Registration success:', result);
  return result as Promise<RegisterRes>;
}

export async function activateUser(uid: string, token: string) {
  const url = `${BASE}/auth/users/activation/`;
  const data = { uid, token };
  console.log('Activating user at:', url, data);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Activation response status:', res.status);

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
      console.log('Activation error:', error);
    } catch {
      error = { message: res.statusText };
    }
    throw new Error(JSON.stringify(error));
  }

  const result = await res.json();
  console.log('Activation success:', result);
  return result as Promise<ActivationRes>;
}

// Profile types
type UserProfile = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
};

export async function getUserProfile() {
  const url = `${BASE}/auth/users/me/`;
  console.log('Fetching user profile from:', url);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  console.log('Profile response status:', res.status);

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
      console.log('Profile error:', error);
    } catch {
      error = { message: res.statusText };
    }
    throw new Error(JSON.stringify(error));
  }

  const result = await res.json();
  console.log('Profile success:', result);
  return result as Promise<UserProfile>;
}
