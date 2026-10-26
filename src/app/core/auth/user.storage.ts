import { MeResponse, Role } from './auth.models';

const USER_KEY = 'rotaone_current_user';

const VALID_ROLES: Role[] = [
  'ADMIN',
  'OPERADOR',
  'MOTORISTA'
];

function isBrowser(): boolean {
  return typeof window !== 'undefined'
    && typeof localStorage !== 'undefined';
}

export const UserStorage = {

  get(): MeResponse | null {
    if (!isBrowser()) return null;

    try {
      const value = localStorage.getItem(USER_KEY);

      if (!value) return null;

      const user: unknown = JSON.parse(value);

      if (
        typeof user !== 'object' ||
        user === null ||
        !('cpf' in user) ||
        !('nome' in user) ||
        !('role' in user)
      ) {
        return null;
      }

      const candidate = user as Record<string, unknown>;

      if (
        typeof candidate['cpf'] !== 'string' ||
        typeof candidate['nome'] !== 'string' ||
        !VALID_ROLES.includes(candidate['role'] as Role)
      ) {
        return null;
      }

      return {
        cpf: candidate['cpf'],
        nome: candidate['nome'],
        role: candidate['role'] as Role
      };

    } catch {
      return null;
    }
  },

  set(user: MeResponse): void {
    if (!isBrowser()) return;

    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        cpf: user.cpf,
        nome: user.nome,
        role: user.role
      })
    );
  },

  clear(): void {
    if (!isBrowser()) return;

    localStorage.removeItem(USER_KEY);
  }
};