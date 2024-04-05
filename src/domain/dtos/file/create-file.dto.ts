export class CreateFileDTO {
  private constructor(
    public readonly name: string,
    public readonly backblazeName: string,
    public readonly propuestaId: string | null,
    public readonly informeFinalId: string | null
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateFileDTO?] {
    const {
      name,
      backblazeName,
      propuestaId = null,
      informeFinalId = null,
    } = object;

    if (!name) return ["Missing name"];
    if (!backblazeName) return ["Missing backBlazeName"];

    //Crear DTO
    return [
      undefined,
      new CreateFileDTO(name, backblazeName, propuestaId, informeFinalId),
    ];
  }
}
