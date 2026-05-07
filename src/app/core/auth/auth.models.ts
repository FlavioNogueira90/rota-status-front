export type Role = 'ADMIN' | 'OPERADOR' | 'MOTORISTA';

export interface LoginRequest {
  cpf: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo?: string; // ex: "Bearer"
}

export interface MeResponse {
  cpf: string;
  role: Role;
}
