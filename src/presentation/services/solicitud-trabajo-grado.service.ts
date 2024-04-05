import { prisma } from "../../database";
import {
  CustomError,
  CreateSolicitudTrabajoGradoDTO,
  SolicitudTrabajoGradoEntity,
} from "../../domain";

export class SolicitudTrabajoGradoService {
  constructor() {}

  public async getByUser(
    estudianteId: string
  ): Promise<SolicitudTrabajoGradoEntity[]> {
    try {
      const getSTG = await prisma.solicitudTrabajoGrado.findFirst({
        where: {
          estudianteId,
        },
        include: {
          estudiante: true,
        },
      });

      if (getSTG) {
        //Crear Entidad
        const solicitudTrabajoGradoEntity =
          SolicitudTrabajoGradoEntity.fromObject(getSTG!);

        return [solicitudTrabajoGradoEntity];
      } else {
        return [];
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async create(
    data: CreateSolicitudTrabajoGradoDTO
  ): Promise<SolicitudTrabajoGradoEntity> {
    try {
      const createSTG = await prisma.solicitudTrabajoGrado.create({
        data,
        include: {
          estudiante: true,
        },
      });

      //Enviar Email

      //Crear Entidad
      const solicitudTrabajoGradoEntity =
        SolicitudTrabajoGradoEntity.fromObject(createSTG);

      return solicitudTrabajoGradoEntity;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
