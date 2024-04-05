import { FileService } from "../../../presentation/services/file.service";
import {
  FilesObjectPropuesta,
  LineaInvestigacionPropuesta,
} from "../../interfaces/propuesta.interface";

export class CreatePropuestaDTO {
  private constructor(
    public readonly userId: string,
    public readonly titulo: string,
    public readonly lineaInvestigacion: LineaInvestigacionPropuesta,
    public readonly problema: string,
    public readonly justificacion: string,
    public readonly objetivo: string,
    public readonly alcance: string,
    public readonly cartaAceptacionDirector: Express.Multer.File,
    public readonly propuestaTrabajoGrado: Express.Multer.File
  ) {}

  static create(
    object: { [key: string]: any },
    files: any
  ): [string?, CreatePropuestaDTO?] {
    //Validaciones de Todos los campos que no son Files
    const {
      userId,
      titulo,
      lineaInvestigacion,
      problema,
      justificacion,
      objetivo,
      alcance,
    } = object;

    let cartaAceptacionDirector: [Express.Multer.File];
    let propuestaTrabajoGrado: [Express.Multer.File];

    const lineasInvestigacion: LineaInvestigacionPropuesta[] = [
      "TELEMATICA_REDES",
      "INGENIERIA_SOFTWARE",
      "OTRA",
    ];

    if (!userId) return ["Missing userId"];
    if (!titulo) return ["Missing titulo"];
    if (!problema) return ["Missing problema"];
    if (!justificacion) return ["Missing justificacion"];
    if (!objetivo) return ["Missing objetivo"];
    if (!alcance) return ["Missing alcance"];

    if (titulo && titulo.length > 1000)
      return ["titulo is too large, max length is 1000 characters"];

    if (problema && problema.length > 10000)
      return ["problema is too large, max length is 10000 characters"];

    if (justificacion && justificacion.length > 10000)
      return ["justificacion is too large, max length is 10000 characters"];

    if (objetivo && objetivo.length > 10000)
      return ["objetivo is too large, max length is 10000 characters"];

    if (alcance && alcance.length > 10000)
      return ["alcance is too large, max length is 10000 characters"];

    if (!lineaInvestigacion) return ["Missing lineaInvestigacion"];
    if (!lineasInvestigacion.includes(lineaInvestigacion))
      return ["Invalid lineaInvestigacion"];

    //Validacion de Files
    if (files !== null && typeof files === "object") {
      const jsonFiles: FilesObjectPropuesta = files as FilesObjectPropuesta;
      cartaAceptacionDirector = jsonFiles["cartaAceptacionDirector"];
      propuestaTrabajoGrado = jsonFiles["propuestaTrabajoGrado"];

      if (!cartaAceptacionDirector) {
        return ["Missing cartaAceptacionDirector file"];
      }

      if (!propuestaTrabajoGrado) {
        return ["Missing propuestaTrabajoGrado file"];
      }

      //Validacion extenciones
      const cartaAceptacionDirectorExt = new FileService().validateExtension(
        [cartaAceptacionDirector[0]],
        ["pdf", "docx"]
      );

      const propuestaTrabajoGradoExt = new FileService().validateExtension(
        [propuestaTrabajoGrado[0]],
        ["pdf", "docx"]
      );

      if (!cartaAceptacionDirectorExt) {
        return ["Invalid extension of cartaAceptacionDirector"];
      }

      if (!propuestaTrabajoGradoExt) {
        return ["Invalid extension of propuestaTrabajoGrado"];
      }
    } else {
      return ["The propuesta files are incomplete"];
    }

    //Crear DTO
    return [
      undefined,
      new CreatePropuestaDTO(
        userId,
        titulo,
        lineaInvestigacion,
        problema,
        justificacion,
        objetivo,
        alcance,
        cartaAceptacionDirector[0],
        propuestaTrabajoGrado[0]
      ),
    ];
  }
}
