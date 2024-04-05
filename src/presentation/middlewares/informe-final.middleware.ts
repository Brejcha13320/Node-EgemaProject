import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../domain";
import { prisma } from "../../database";

export class InformeFinalMiddleware {
  static async validateCreateInformeFinal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //Verificar que no exista otra Propuesta
      const userId = req.body.user.id;

      const STG = await prisma.solicitudTrabajoGrado.findFirst({
        where: {
          estudianteId: userId,
        },
      });

      if (!STG) {
        return res.status(409).json({
          success: false,
          error: "No se ha creado una solicitud",
        });
      }

      const propuesta = await prisma.propuesta.findFirst({
        where: {
          solicitudTrabajoGradoId: STG.id,
        },
      });

      if (!propuesta) {
        return res.status(409).json({
          success: false,
          error: "No se ha creado una propuesta",
        });
      }

      const informeFinal = await prisma.informeFinal.findFirst({
        where: {
          propuestaId: propuesta.id,
        },
      });

      if (informeFinal) {
        return res.status(409).json({
          success: false,
          error: "No se puede crear otro informe final",
        });
      }

      next();
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
