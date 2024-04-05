import { JwtAdapter } from "../../../config";

export class GetFileDTO {
  private constructor(public readonly id: string) {}

  static create(object: { [key: string]: any }): [string?, GetFileDTO?] {
    const { token, id } = object;

    if (!token) return ["Missing token"];

    try {
      const payload = async () =>
        await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        return ["Invalid token"];
      }
    } catch (error) {
      return ["Error in decode token"];
    }

    if (!id) return ["Missing id"];

    //Crear DTO
    return [undefined, new GetFileDTO(id)];
  }
}
