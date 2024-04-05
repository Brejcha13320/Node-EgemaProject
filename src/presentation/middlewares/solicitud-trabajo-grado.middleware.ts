import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../domain";
import { prisma } from "../../database";

export class SolicitudTrabajoGradoMiddleware {
  static async validateCreateSTG(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //Verificar que no exista otra STG en APROBADO / PENDIENTE
      const userId = req.body.user.id;

      const STG = await prisma.solicitudTrabajoGrado.findFirst({
        where: {
          estudianteId: userId,
        },
      });

      if (STG) {
        //Existen al menos 1 STG, entonces no puede crear otra
        return res.status(409).json({
          success: false,
          error: "Solo puedes crear una solicitud de trabajo de grado.",
        });
      }

      next();
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
