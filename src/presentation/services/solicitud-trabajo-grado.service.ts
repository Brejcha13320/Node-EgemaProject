import { prisma } from "../../database";
import {
  CreateSolicitudTrabajoGradoDTO,
  SolicitudTrabajoGrado,
} from "../../domain";

export class SolicitudTrabajoGradoService {
  constructor() {}

  public async getByUser(
    estudianteId: string
  ): Promise<SolicitudTrabajoGrado[]> {
    const getSTG = await prisma.solicitudTrabajoGrado.findFirst({
      where: {
        estudianteId,
      },
      include: {
        estudiante: true,
      },
    });

    if (getSTG) {
      const STG = getSTG as SolicitudTrabajoGrado;
      return [STG];
    } else {
      return [];
    }
  }

  public async create(
    data: CreateSolicitudTrabajoGradoDTO
  ): Promise<SolicitudTrabajoGrado> {
    const createSTG = await prisma.solicitudTrabajoGrado.create({
      data,
      include: {
        estudiante: true,
      },
    });

    /**
     * TODO: Enviar Email
     */

    return createSTG as SolicitudTrabajoGrado;
  }
}
