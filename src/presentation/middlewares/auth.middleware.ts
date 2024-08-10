import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { prisma } from "../../database";
import { User } from "../../domain";

export class AuthMiddleware {
  static async validateToken(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");

    if (!authorization)
      return res
        .status(401)
        .json({ authorization: false, error: "Not token provided" });

    if (!authorization.startsWith("Bearer "))
      return res
        .status(401)
        .json({ authorization: false, error: "Invalid Bearer token" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload)
        return res
          .status(401)
          .json({ authorization: false, error: "Invalid token" });

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user)
        return res.status(401).json({
          authorization: false,
          error: "Invalid token - user not found",
        });

      const { password, ...bodyUser } = user as User;
      req.body.user = bodyUser;
      next();
    } catch (error) {
      res
        .status(500)
        .json({ authorization: false, error: "Internal Server Error" });
    }
  }
}
