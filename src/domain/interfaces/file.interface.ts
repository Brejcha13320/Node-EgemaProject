export interface File {
  id: string;
  name: string;
  backblazeName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * FIXME: Esto se va quitar!!!
 */

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
