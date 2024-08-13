import { Propuesta } from "./propuesta.interface";
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
  propuesta: Propuesta;
  director: User;
  codirector: User;
  jurados: Jurado[];
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

export interface Jurado {
  id: string;
  userId: string;
  informeFinalId: string;
  comentario: String;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}
export interface CreateJurado {
  userId: string;
  informeFinalId: string;
}

// FIXME: no se que hace
export interface FilesObjectInformeFinal {
  informeFinal: [Express.Multer.File];
}

export interface FileObjectInformeFinal {
  file: [Express.Multer.File];
}

export type EstadoInformeFinal = "APROBADO" | "PENDIENTE" | "NO_APROBADO";
export type TipoInformeFinalFile = "INFORME_FINAL";
