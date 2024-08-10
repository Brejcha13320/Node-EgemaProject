export interface SolicitudTrabajoGrado {
  id: string;
  estudianteId: string;
  opcion: OpcionSolicitudTrabajoGrado;
  createdAt: Date;
  updatedAt: Date;
}

export type OpcionSolicitudTrabajoGrado =
  | "TRABAJO_GRADO"
  | "INVESTIGACION"
  | "ESPECIALIZACION"
  | "PRUEBAS_SABER_PRO";
