export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: RolUser;
}

export interface RequestRegisterUser {
  user: Omit<User, "password">;
}

export interface RequestLoginUser {
  user: Omit<User, "password">;
  token: string;
}

export type RegisterUser = Omit<User, "id" | "rol">;

export type RolUser =
  | "ESTUDIANTE"
  | "DOCENTE"
  | "COMITE"
  | "JEFE_PRACTICA"
  | "COORDINADOR_PRACTICA"
  | "ADMIN";
