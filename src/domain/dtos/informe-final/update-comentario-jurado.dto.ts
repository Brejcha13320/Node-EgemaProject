export class UpdateComentarioJuradoDTO {
  private constructor(public readonly comentario: string) {}

  static create(object: {
    [key: string]: any;
  }): [string?, UpdateComentarioJuradoDTO?] {
    //Validaciones de Todos los campos que no son Files
    const { comentario } = object;

    if (!comentario) return ["Missing comentario"];

    //Crear DTO
    return [undefined, new UpdateComentarioJuradoDTO(comentario)];
  }
}
