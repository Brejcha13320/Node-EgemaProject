export interface File {
  id: string;
  name: string;
  backblazeName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FolderDropbox = "propuesta";

export type ValidExtension = "pdf" | "docx";
