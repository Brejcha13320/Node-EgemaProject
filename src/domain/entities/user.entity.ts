import { CustomError } from "../errors/custom-errors";
import { RolUser } from "../interfaces/user.interface";

export class UserEntity {
  constructor(
    public id: string,
    public nombre: string,
    public email: string,
    public password: string,
    public rol: RolUser,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const roles: RolUser[] = [
      "ESTUDIANTE",
      "DOCENTE",
      "COMITE",
      "JEFE_PRACTICA",
      "COORDINADOR_PRACTICA",
      "ADMIN",
    ];
    const { id, nombre, email, password, rol, createdAt, updatedAt } = object;

    if (!id) throw CustomError.badRequest("Missing id");
    if (!nombre) throw CustomError.badRequest("Missing nombre");
    if (!email) throw CustomError.badRequest("Missing email");
    if (!password) throw CustomError.badRequest("Missing password");
    if (!rol) throw CustomError.badRequest("Missing rol");
    if (!roles.includes(rol)) throw CustomError.badRequest("Rol is not valid");
    if (!createdAt) throw CustomError.badRequest("Missing createdAt");
    if (!updatedAt) throw CustomError.badRequest("Missing updatedAt");

    return new UserEntity(
      id,
      nombre,
      email,
      password,
      rol,
      createdAt,
      updatedAt
    );
  }
}
