import { PREFIX } from "@lri/global";

const AUTH_TOKEN_STORAGE_KEY = `${PREFIX}/auth-token`;

export function readAuthToken(): string | undefined {
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)?.trim();
  return token || undefined;
}

export function saveAuthToken(token: string): void {
  const value = token.trim();
  if (!value) {
    clearAuthToken();
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, value);
}

export function clearAuthToken(): void {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}
