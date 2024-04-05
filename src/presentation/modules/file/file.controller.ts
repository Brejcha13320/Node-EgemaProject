import { Request, Response } from "express";
import { GetFileDTO, HandleError } from "../../../domain";
import { FileService } from "../../services/file.service";

export class FileController {
  constructor(private fileService: FileService) {}

  getFile = (req: Request, res: Response) => {
    const [error, getFileDTO] = GetFileDTO.create(req.params);
    if (error) return res.status(400).json({ error });

    this.fileService
      .getFileToBackblaze(getFileDTO!.id)
      .then(({ buffer, name }) => {
        // Devuelve el archivo como respuesta
        res.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename=${name}`, // Nombre del archivo descargado
        });
        res.end(buffer);
      })
      .catch((error) => HandleError.error(error, res));
  };
}
