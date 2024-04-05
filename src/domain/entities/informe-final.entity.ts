import { EstadoInformeFinal } from "@prisma/client";
import { CustomError } from "../errors/custom-errors";
import { Propuesta } from "../interfaces/propuesta.interface";
import { FileEntity } from "./file.entity";
import { PropuestaEntity } from "./propuesta.entity";

export class InformeFinalEntity {
  constructor(
    public id: string,
    public propuestaId: string,
    public directorId: string,
    public codirectorId: string | null,
    public recomendaciones: string,
    public conclusiones: string,
    public trabajoFuturo: string,
    public informeFinal: string,
    public estado: EstadoInformeFinal,
    public createdAt: Date,
    public updatedAt: Date,
    public propuesta: Propuesta,
    public files: File[]
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const estados: EstadoInformeFinal[] = [
      "APROBADO",
      "PENDIENTE",
      "NO_APROBADO",
    ];

    let {
      id,
      propuestaId,
      directorId,
      codirectorId = null,
      recomendaciones,
      conclusiones,
      trabajoFuturo,
      informeFinal,
      estado,
      createdAt,
      updatedAt,
      propuesta,
      files,
    } = object;

    if (!id) throw CustomError.badRequest("Missing id");
    // if (!propuestaId) throw CustomError.badRequest("Missing propuestaId");
    if (!directorId) throw CustomError.badRequest("Missing directorId");
    if (!recomendaciones)
      throw CustomError.badRequest("Missing recomendaciones");
    if (!conclusiones) throw CustomError.badRequest("Missing conclusiones");
    if (!trabajoFuturo) throw CustomError.badRequest("Missing trabajoFuturo");
    if (!informeFinal) throw CustomError.badRequest("Missing informeFinal");
    if (!estado) throw CustomError.badRequest("Missing estado");
    if (!estados.includes(estado))
      throw CustomError.badRequest("estado is not valid");
    if (!createdAt) throw CustomError.badRequest("Missing createdAt");
    if (!updatedAt) throw CustomError.badRequest("Missing updatedAt");

    if (propuesta) {
      propuesta = PropuestaEntity.fromObject(propuesta);
    }

    if (Array.isArray(files) && files.length > 0) {
      files.map((file) => FileEntity.fromObject(file));
    }

    return new InformeFinalEntity(
      id,
      propuestaId,
      directorId,
      codirectorId,
      recomendaciones,
      conclusiones,
      trabajoFuturo,
      informeFinal,
      estado,
      createdAt,
      updatedAt,
      propuesta,
      files
    );
  }
}
