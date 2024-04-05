import { OpcionSolicitudTrabajoGrado } from ".prisma/client";
import { CustomError } from "../errors/custom-errors";
import { RequestRegisterUser } from "../interfaces/user.interface";
import { UserEntity } from "./user.entity";

export class SolicitudTrabajoGradoEntity {
  constructor(
    public id: string,
    public estudianteId: string = "",
    public opcion: OpcionSolicitudTrabajoGrado,
    public createdAt: Date,
    public updatedAt: Date,
    public estudiante: RequestRegisterUser
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const opciones: OpcionSolicitudTrabajoGrado[] = [
      "ESPECIALIZACION",
      "INVESTIGACION",
      "PRUEBAS_SABER_PRO",
      "TRABAJO_GRADO",
    ];

    let { id, estudianteId, opcion, createdAt, updatedAt, estudiante } = object;

    if (!id) throw CustomError.badRequest("Missing id");
    if (!estudianteId) throw CustomError.badRequest("Missing estudianteId");
    if (!opcion) throw CustomError.badRequest("Missing opcion");
    if (!opciones.includes(opcion))
      throw CustomError.badRequest("Opcion is not valid");
    if (!createdAt) throw CustomError.badRequest("Missing createdAt");
    if (!updatedAt) throw CustomError.badRequest("Missing updatedAt");

    if (estudiante) {
      const { password, ...restUser } = UserEntity.fromObject(estudiante);
      estudiante = restUser;
    }

    return new SolicitudTrabajoGradoEntity(
      id,
      estudianteId,
      opcion,
      createdAt,
      updatedAt,
      estudiante
    );
  }
}
