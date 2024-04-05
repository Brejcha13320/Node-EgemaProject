import { Propuesta } from "./propuesta.interface";

export interface File {
  id: string;
  propuestaId: string | null;
  dropboxId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataCreateFile {
  file: Express.Multer.File;
  propuestaId: string | null;
  informeFinalId: string | null;
}

export type FolderDropbox = "propuesta";

export type ValidExtension = "pdf" | "docx";

export interface CreateFile {
  id: string;
  propuestaId: string | null;
  cloudinaryId: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
