import { regularExps } from "../../../config";

export class RegisterUserDto {
  private constructor(
    public readonly nombre: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { nombre, email, password } = object;

    if (!nombre) return ["Missing nombre"];
    if (!email) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];
    if (!password) return ["Missing password"];
    if (password.length < 6) return ["Password too short"];

    return [undefined, new RegisterUserDto(nombre, email, password)];
  }
}
