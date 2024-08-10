import { User } from "./user.interface";

export interface SolicitudTrabajoGrado {
  id: string;
  estudianteId: string;
  opcion: OpcionSolicitudTrabajoGrado;
  createdAt: Date;
  updatedAt: Date;
  estudiante: User;
}

export type OpcionSolicitudTrabajoGrado =
  | "TRABAJO_GRADO"
  | "INVESTIGACION"
  | "ESPECIALIZACION"
  | "PRUEBAS_SABER_PRO";
