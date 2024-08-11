import { User } from "./user.interface";

export interface InformeFinal {
  id: string;
  propuestaId: string;
  directorId: string;
  codirectorId: string;
  conclusiones: string;
  trabajoFuturo: string;
  estado: EstadoInformeFinal;
  files: InformeFinalFile[];
  director: User;
  codirector: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface InformeFinalFile {
  id: string;
  fileId: string;
  informeFinalId: string;
  tipo: TipoInformeFinalFile;
  file: File;
}

// FIXME: no se que hace
export interface FilesObjectInformeFinal {
  informeFinal: [Express.Multer.File];
}

export type EstadoInformeFinal = "APROBADO" | "PENDIENTE" | "NO_APROBADO";
export type TipoInformeFinalFile = "INFORME_FINAL";
