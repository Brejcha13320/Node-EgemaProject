import { FileService } from "../../../presentation/services/file.service";
import { FileObjectInformeFinal } from "../../interfaces/informe-final.interface";

export class UpdateInformeFinalFileDTO {
  private constructor(
    public readonly informeFinalFileId: string,
    public readonly file: Express.Multer.File
  ) {}

  static create(
    object: {
      [key: string]: any;
    },
    files: any
  ): [string?, UpdateInformeFinalFileDTO?] {
    //Validaciones de Todos los campos que no son Files
    const { informeFinalFileId } = object;

    let file: [Express.Multer.File];

    if (!informeFinalFileId) return ["Missing informeFinalFileId"];

    //Validacion de Files
    if (files !== null && typeof files === "object") {
      const jsonFiles: FileObjectInformeFinal = files as FileObjectInformeFinal;
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
      return ["The informe final files are incomplete"];
    }

    //Crear DTO
    return [
      undefined,
      new UpdateInformeFinalFileDTO(informeFinalFileId, file[0]),
    ];
  }
}
