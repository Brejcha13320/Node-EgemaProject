import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { prisma } from "../../database";
import {
  RegisterUser,
  RequestLoginUser,
  RequestRegisterUser,
  UserEntity,
  registerEmailTemplate,
} from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { CustomError } from "../../domain/errors/custom-errors";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(private emailService: EmailService) {}

  public async loginUser(
    loginUserDto: LoginUserDto
  ): Promise<RequestLoginUser> {
    const user = await prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });

    if (!user) throw CustomError.badRequest("Invalid credentials");

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );

    if (!isMatching) throw CustomError.badRequest("Invalid credentials");

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = (await JwtAdapter.generateToken(
      { id: user.id },
      "6h"
    )) as string;

    if (!token) throw CustomError.badRequest("Error while creating JWT");

    return { user: userEntity, token };
  }

  public async registerUser(
    registerUserDto: RegisterUserDto
  ): Promise<RequestRegisterUser> {
    const existUser = await prisma.user.findUnique({
      where: { email: registerUserDto.email },
    });

    if (existUser) throw CustomError.badRequest("Email already exist");

    //Encriptar Password
    const passwordEncripted = bcryptAdapter.hash(registerUserDto.password);
    const user: RegisterUser = {
      ...registerUserDto,
      password: passwordEncripted,
    };

    //Crear Usuario
    const userCreate = await prisma.user.create({ data: user });

    //Enviar Email
    await this.sendRegisterEmail(user.email, user.nombre);

    //Crear Entidad
    const { password, ...userEntity } = UserEntity.fromObject(userCreate);

    return { user: userEntity };
  }

  private async sendRegisterEmail(email: string, nombre: string) {
    const isSent = await this.emailService.sendEmail({
      to: email,
      subject: "✔️ Registro Exitoso",
      htmlBody: registerEmailTemplate(nombre, envs.EGEMA_PROJECT_URL),
    });

    if (!isSent) throw CustomError.badRequest("Error sending register email");

    return true;
  }
}
