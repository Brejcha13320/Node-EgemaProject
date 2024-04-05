import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database";
import { CustomError } from "../../domain";

export class PropuestaMiddleware {
  static async validateCreatePropuesta(
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

      if (propuesta) {
        return res.status(409).json({
          success: false,
          error: "No se puede crear otra propuesta",
        });
      }

      next();
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  static async validateExistsPropuesta(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //Verificar que no exista otra STG en APROBADO / PENDIENTE
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "El id de la propuesta es obligatorio",
        });
      }

      const propuesta = await prisma.propuesta.findFirst({
        where: {
          id,
        },
      });

      if (!propuesta) {
        return res.status(400).json({
          success: false,
          error: "No existe una propuesta con ese id",
        });
      }

      next();
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  static async validateUpdatePropuestaEstudiante(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //Verificar que no exista otra STG en APROBADO / PENDIENTE
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "El id de la propuesta es obligatorio",
        });
      }

      const propuesta = await prisma.propuesta.findFirst({
        where: {
          id,
        },
      });

      if (!propuesta) {
        return res.status(400).json({
          success: false,
          error: "No existe una propuesta con ese id",
        });
      }

      if (propuesta.estado != "CAMBIOS") {
        return res.status(400).json({
          success: false,
          error:
            "No puedes editar una propuesta que no esta en estado de CAMBIOS",
        });
      }

      next();
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
