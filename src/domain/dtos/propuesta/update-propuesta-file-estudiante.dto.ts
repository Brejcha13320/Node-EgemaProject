import { FileService } from "../../../presentation/services/file.service";
import { FileObjectPropuesta } from "../../interfaces/propuesta.interface";

export class UpdatePropuestaFileEstudianteDTO {
  private constructor(
    public readonly propuestaFileId: string,
    public readonly file: Express.Multer.File
  ) {}

  static create(
    object: { [key: string]: any },
    files: any
  ): [string?, UpdatePropuestaFileEstudianteDTO?] {
    //Validaciones de Todos los campos que no son Files
    const { propuestaFileId } = object;

    let file: [Express.Multer.File];

    if (!propuestaFileId) return ["Missing propuestaFileId"];

    //Validacion de Files
    if (files !== null && typeof files === "object") {
      const jsonFiles: FileObjectPropuesta = files as FileObjectPropuesta;
      file = jsonFiles["file"];

      if (!file) {
        return ["Missing file"];
      }

      //Validacion extenciones
      const fileExt = new FileService().validateExtension(
        [file[0]],
        ["pdf", "docx"]
      );

      if (!fileExt) {
        return ["Invalid extension of file"];
      }
    } else {
      return ["The propuesta files are incomplete"];
    }

    //Crear DTO
    return [
      undefined,
      new UpdatePropuestaFileEstudianteDTO(propuestaFileId, file[0]),
    ];
  }
}
