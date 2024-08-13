export class UpdateInformeFinalDTO {
  private constructor(
    public readonly directorId: string,
    public readonly codirectorId: string | null,
    public readonly conclusiones: string,
    public readonly trabajoFuturo: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, UpdateInformeFinalDTO?] {
    //Validaciones de Todos los campos que no son Files
    const { directorId, codirectorId, conclusiones, trabajoFuturo } = object;

    let informeFinal: [Express.Multer.File];

    if (!directorId) return ["Missing directorId"];
    if (!conclusiones) return ["Missing conclusiones"];
    if (!trabajoFuturo) return ["Missing trabajoFuturo"];

    //Crear DTO
    return [
      undefined,
      new UpdateInformeFinalDTO(
        directorId,
        codirectorId ?? null,
        conclusiones,
        trabajoFuturo
      ),
    ];
  }
}
