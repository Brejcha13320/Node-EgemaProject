import { LineaInvestigacionPropuesta } from "../../interfaces/propuesta.interface";

export class UpdatePropuestaDTO {
  private constructor(
    public readonly titulo: string,
    public readonly lineaInvestigacion: LineaInvestigacionPropuesta,
    public readonly problema: string,
    public readonly objetivo: string,
    public readonly alcance: string,
    public readonly justificacion: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, UpdatePropuestaDTO?] {
    const lineasInvestigacion: LineaInvestigacionPropuesta[] = [
      "TELEMATICA_REDES",
      "INGENIERIA_SOFTWARE",
      "OTRA",
    ];

    //Validaciones de Todos los campos que no son Files
    const {
      titulo,
      lineaInvestigacion,
      problema,
      objetivo,
      alcance,
      justificacion,
    } = object;

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

    //Crear DTO
    return [
      undefined,
      new UpdatePropuestaDTO(
        titulo,
        lineaInvestigacion,
        problema,
        objetivo,
        alcance,
        justificacion
      ),
    ];
  }
}
