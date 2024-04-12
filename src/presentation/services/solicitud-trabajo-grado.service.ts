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
  }

  public async create(
    data: CreateSolicitudTrabajoGradoDTO
  ): Promise<SolicitudTrabajoGradoEntity> {
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
  }
}
