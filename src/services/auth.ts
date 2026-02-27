export interface AuthResponse {
  token: string;
  user?: {
    name?: string;
    email?: string;
  };
}

const getBase = () => import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function loginApi(username: string, password: string): Promise<AuthResponse> {
  const base = getBase();
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const text = await res.text();
  try {
    const json = JSON.parse(text || '{}');
    if (!res.ok) throw new Error(json.message || text || 'Login failed');
    return json as AuthResponse;
  } catch (e) {
    if (!res.ok) throw new Error(text || 'Login failed');
    return JSON.parse(text) as AuthResponse;
  }
}

export async function registerApi(name: string, email: string, password: string): Promise<AuthResponse> {
  const base = getBase();
  const res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const text = await res.text();
  try {
    const json = JSON.parse(text || '{}');
    if (!res.ok) throw new Error(json.message || text || 'Register failed');
    return json as AuthResponse;
  } catch (e) {
    if (!res.ok) throw new Error(text || 'Register failed');
    return JSON.parse(text) as AuthResponse;
  }
}

export function saveToken(token: string) {
  localStorage.setItem('authToken', token);
}

export function clearToken() {
  localStorage.removeItem('authToken');
}
