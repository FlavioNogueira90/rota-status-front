const TOKEN_KEY = 'rota_status_token';
const TOKEN_TYPE_KEY = 'rota_status_token_type';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export const TokenStorage = {
  getToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getType(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(TOKEN_TYPE_KEY);
  },

  set(token: string, tipo?: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(TOKEN_KEY, token);
    if (tipo) localStorage.setItem(TOKEN_TYPE_KEY, tipo);
    else localStorage.removeItem(TOKEN_TYPE_KEY);
  },

  clear(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
  },

  isLogged(): boolean {
    if (!isBrowser()) return false;
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
