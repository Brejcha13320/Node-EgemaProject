import { File } from "./file.interface";
import { SolicitudTrabajoGrado } from "./solicitud-trabajo-grado.interface";

export interface FilesObjectPropuesta {
  cartaAceptacionDirector: [Express.Multer.File];
  propuestaTrabajoGrado: [Express.Multer.File];
}

export interface Propuesta {
  id: string;
  solicitudTrabajoGradoId: string;
  titulo: string;
  lineaInvestigacion: LineaInvestigacionPropuesta;
  estado: EstadoPropuesta;
  problema: string;
  justificacion: string;
  objetivo: string;
  alcance: string;
  comentarios: string;
  cartaAceptacionDirector: string;
  propuestaTrabajoGrado: string;
  createdAt: Date;
  updatedAt: Date;
  files: File[];
  solicitudTrabajoGrado: SolicitudTrabajoGrado;
}

export type LineaInvestigacionPropuesta =
  | "TELEMATICA_REDES"
  | "INGENIERIA_SOFTWARE"
  | "OTRA";

export type EstadoPropuesta =
  | "APROBADO"
  | "PENDIENTE"
  | "CAMBIOS"
  | "NO_APROBADO";
