export class UpdateEstadoPendienteInformeFinalDTO {
  private constructor(public readonly estado: "PENDIENTE") {}

  static create(object: {
    [key: string]: any;
  }): [string?, UpdateEstadoPendienteInformeFinalDTO?] {
    //Validaciones de Todos los campos que no son Files
    const { estado } = object;

    if (!estado) return ["Missing estado"];
    if (estado !== "PENDIENTE") return ["Invalid estado"];

    //Crear DTO
    return [undefined, new UpdateEstadoPendienteInformeFinalDTO(estado)];
  }
}
