import { EstadoPropuesta } from "../../interfaces/propuesta.interface";

export class UpdateEstadoPropuestaDTO {
  private constructor(
    public readonly estado: EstadoPropuesta,
    public readonly comentarios: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, UpdateEstadoPropuestaDTO?] {
    //Validaciones de Todos los campos que no son Files
    const { estado, comentarios = "" } = object;

    const estados: EstadoPropuesta[] = [
      "APROBADO",
      "PENDIENTE",
      "CAMBIOS",
      "NO_APROBADO",
    ];

    if (!estado) return ["Missing estado"];
    if (!estados.includes(estado)) return ["Invalid estado"];

    if (comentarios && comentarios.length > 10000)
      return ["comentarios is too large, max length is 10000 characters"];

    //Crear DTO
    return [undefined, new UpdateEstadoPropuestaDTO(estado, comentarios)];
  }
}
