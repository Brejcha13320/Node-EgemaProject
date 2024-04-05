import { CustomError } from "../errors/custom-errors";
import {
  EstadoPropuesta,
  LineaInvestigacionPropuesta,
} from "../interfaces/propuesta.interface";
import { SolicitudTrabajoGrado } from "../interfaces/solicitud-trabajo-grado.interface";
import { FileEntity } from "./file.entity";
import { SolicitudTrabajoGradoEntity } from "./solicitud-trabajo-grado.entity";

export class PropuestaEntity {
  constructor(
    public id: string,
    public solicitudTrabajoGradoId: string,
    public titulo: string,
    public lineaInvestigacion: LineaInvestigacionPropuesta,
    public estado: EstadoPropuesta,
    public problema: string,
    public justificacion: string,
    public objetivo: string,
    public alcance: string,
    public comentarios: string,
    public cartaAceptacionDirector: string,
    public propuestaTrabajoGrado: string,
    public createdAt: Date,
    public updatedAt: Date,
    public solicitudTrabajoGrado: SolicitudTrabajoGrado,
    public files: File[]
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const estados: EstadoPropuesta[] = [
      "APROBADO",
      "PENDIENTE",
      "CAMBIOS",
      "NO_APROBADO",
    ];
    const lineasInvestigacion: LineaInvestigacionPropuesta[] = [
      "TELEMATICA_REDES",
      "INGENIERIA_SOFTWARE",
      "OTRA",
    ];

    let {
      id,
      solicitudTrabajoGradoId,
      titulo,
      lineaInvestigacion,
      estado,
      problema,
      justificacion,
      objetivo,
      alcance,
      comentarios = "",
      cartaAceptacionDirector,
      propuestaTrabajoGrado,
      createdAt,
      updatedAt,
      files,
      solicitudTrabajoGrado,
    } = object;

    if (!id) throw CustomError.badRequest("Missing id");
    if (!solicitudTrabajoGradoId)
      throw CustomError.badRequest("Missing solicitudTrabajoGradoId");
    if (!titulo) throw CustomError.badRequest("Missing titulo");
    if (!problema) throw CustomError.badRequest("Missing problema");
    if (!justificacion) throw CustomError.badRequest("Missing justificacion");
    if (!objetivo) throw CustomError.badRequest("Missing objetivo");
    if (!alcance) throw CustomError.badRequest("Missing alcance");
    if (!cartaAceptacionDirector)
      throw CustomError.badRequest("Missing cartaAceptacionDirector");
    if (!propuestaTrabajoGrado)
      throw CustomError.badRequest("Missing propuestaTrabajoGrado");
    if (!lineaInvestigacion)
      throw CustomError.badRequest("Missing lineaInvestigacion");
    if (!lineasInvestigacion.includes(lineaInvestigacion))
      throw CustomError.badRequest("lineasInvestigacion is not valid");
    if (!estado) throw CustomError.badRequest("Missing estado");
    if (!estados.includes(estado))
      throw CustomError.badRequest("estado is not valid");
    if (!createdAt) throw CustomError.badRequest("Missing createdAt");
    if (!updatedAt) throw CustomError.badRequest("Missing updatedAt");

    if (solicitudTrabajoGrado) {
      solicitudTrabajoGrado = SolicitudTrabajoGradoEntity.fromObject(
        solicitudTrabajoGrado
      );
    }

    if (Array.isArray(files) && files.length > 0) {
      files.map((file) => FileEntity.fromObject(file));
    }

    return new PropuestaEntity(
      id,
      solicitudTrabajoGradoId,
      titulo,
      lineaInvestigacion,
      estado,
      problema,
      justificacion,
      objetivo,
      alcance,
      comentarios,
      cartaAceptacionDirector,
      propuestaTrabajoGrado,
      createdAt,
      updatedAt,
      solicitudTrabajoGrado,
      files
    );
  }
}
