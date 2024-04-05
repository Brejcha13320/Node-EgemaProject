import { Request, Response } from "express";
import { HandleError, LoginUserDto, RegisterUserDto } from "../../../domain";
import { AuthService } from "../../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService
      .loginUser(loginUserDto!)
      .then((loginUser) => res.status(201).json(loginUser))
      .catch((error) => HandleError.error(error, res));
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService
      .registerUser(registerUserDto!)
      .then((registerUser) => res.status(201).json(registerUser))
      .catch((error) => HandleError.error(error, res));
  };

  validateToken = (req: Request, res: Response) => {
    res.status(201).json({ authorization: true });
  };
}
