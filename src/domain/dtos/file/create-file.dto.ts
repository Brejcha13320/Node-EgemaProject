export class CreateFileDTO {
  private constructor(
    public readonly name: string,
    public readonly backblazeName: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateFileDTO?] {
    const { name, backblazeName } = object;

    if (!name) return ["Missing name"];
    if (!backblazeName) return ["Missing backBlazeName"];

    //Crear DTO
    return [undefined, new CreateFileDTO(name, backblazeName)];
  }
}
