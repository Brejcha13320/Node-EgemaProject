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

  static async validateUpdateInformeFinal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "El id del informe final es obligatorio",
        });
      }

      const informeFinal = await prisma.informeFinal.findFirst({
        where: {
          id,
        },
      });

      if (!informeFinal) {
        return res.status(400).json({
          success: false,
          error: "No existe una propuesta con ese id",
        });
      }

      if (informeFinal.estado != "CAMBIOS") {
        return res.status(400).json({
          success: false,
          error:
            "No puedes editar un informe final que no esta en estado de CAMBIOS",
        });
      }

      next();
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  static async createJuradosInformeFinal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const jurados = req.body;
      let errors: string[] = [];

      if (!Array.isArray(jurados)) {
        return res.status(409).json({
          success: false,
          error: "Debe enviar un arreglo de Jurados",
        });
      }

      if (jurados.length > 3) {
        return res.status(409).json({
          success: false,
          error: "Solo puede enviar un maximo de 3 Jurados",
        });
      }

      jurados.forEach(({ userId, informeFinalId }, i) => {
        if (!userId) {
          errors.push(`Missing userId in ${i} item`);
        }

        if (!informeFinalId) {
          errors.push(`Missing informeFinalId in ${i} item`);
        }
      });

      if (errors.length > 0) {
        return res.status(409).json({
          success: false,
          error: errors,
        });
      }

      next();
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
