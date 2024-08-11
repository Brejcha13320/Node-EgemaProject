import { FileService } from "../../../presentation/services/file.service";
import { FilesObjectInformeFinal } from "../../interfaces/informe-final.interface";

export class CreateInformeFinalDTO {
  private constructor(
    public readonly userId: string,
    public readonly directorId: string,
    public readonly codirectorId: string | null,
    public readonly conclusiones: string,
    public readonly trabajoFuturo: string,
    public readonly informeFinal: Express.Multer.File
  ) {}

  static create(
    object: { [key: string]: any },
    files: any
  ): [string?, CreateInformeFinalDTO?] {
    //Validaciones de Todos los campos que no son Files
    const { userId, directorId, codirectorId, conclusiones, trabajoFuturo } =
      object;

    let informeFinal: [Express.Multer.File];

    if (!userId) return ["Missing userId"];
    if (!directorId) return ["Missing directorId"];
    if (!conclusiones) return ["Missing conclusiones"];
    if (!trabajoFuturo) return ["Missing trabajoFuturo"];

    if (conclusiones && conclusiones.length > 10000)
      return ["conclusiones is too large, max length is 10000 characters"];

    if (trabajoFuturo && trabajoFuturo.length > 10000)
      return ["trabajoFuturo is too large, max length is 10000 characters"];

    //Validacion de Files
    if (files !== null && typeof files === "object") {
      const jsonFiles: FilesObjectInformeFinal =
        files as FilesObjectInformeFinal;

      informeFinal = jsonFiles["informeFinal"];

      if (!informeFinal) {
        return ["Missing informeFinal file"];
      }

      // Validacion extenciones
      const informeFinalExt = new FileService().validateExtension(
        [informeFinal[0]],
        ["pdf", "docx"]
      );

      if (!informeFinalExt) {
        return ["Invalid extension of informeFinal"];
      }
    } else {
      return ["The informeFinal files are incomplete"];
    }

    //Crear DTO
    return [
      undefined,
      new CreateInformeFinalDTO(
        userId,
        directorId,
        codirectorId ?? null,
        conclusiones,
        trabajoFuturo,
        informeFinal[0]
      ),
    ];
  }
}
