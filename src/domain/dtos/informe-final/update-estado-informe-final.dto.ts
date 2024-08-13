import { EstadoInformeFinal } from "@prisma/client";

export class UpdateEstadoInformeFinalDTO {
  private constructor(public readonly estado: EstadoInformeFinal) {}

  static create(object: {
    [key: string]: any;
  }): [string?, UpdateEstadoInformeFinalDTO?] {
    //Validaciones de Todos los campos que no son Files
    const { estado } = object;

    const estados: EstadoInformeFinal[] = [
      "APROBADO",
      "PENDIENTE",
      "CAMBIOS",
      "NO_APROBADO",
    ];

    if (!estado) return ["Missing estado"];
    if (!estados.includes(estado)) return ["Invalid estado"];

    //Crear DTO
    return [undefined, new UpdateEstadoInformeFinalDTO(estado)];
  }
}
