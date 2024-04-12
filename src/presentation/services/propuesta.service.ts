import { prisma } from "../../database";
import { CustomError, EstadoPropuesta } from "../../domain";
import { CreatePropuestaDTO } from "../../domain/dtos/propuesta/create-propuesta.dto";
import { PropuestaEntity } from "../../domain/entities/propuesta.entity";
import { FileService } from "./file.service";
import { SolicitudTrabajoGradoService } from "./solicitud-trabajo-grado.service";
import { UpdatePropuestaEstudianteDTO } from "../../domain/dtos/propuesta/update-propuesta-estudiante.dto";

export class PropuestaService {
  constructor(
    private fileService: FileService,
    private solicitudTrabajoGradoService: SolicitudTrabajoGradoService
  ) {}

  public async getAll(): Promise<PropuestaEntity[]> {
    const propuestas = await prisma.propuesta.findMany({
      include: {
        solicitudTrabajoGrado: {
          include: {
            estudiante: true,
          },
        },
        files: true,
      },
    });

    const propuestasEntity: PropuestaEntity[] = [];

    for (let propuesta of propuestas) {
      propuestasEntity.push(PropuestaEntity.fromObject(propuesta));
    }

    return propuestasEntity;
  }

  public async getById(id: string): Promise<PropuestaEntity> {
    const propuesta = await prisma.propuesta.findFirst({
      where: {
        id,
      },
      include: {
        solicitudTrabajoGrado: {
          include: {
            estudiante: true,
          },
        },
        files: true,
      },
    });

    if (!propuesta) {
      throw CustomError.internalServer(`No existe una propuesta con ese id`);
    }

    const propuestaEntity = PropuestaEntity.fromObject(propuesta);

    return propuestaEntity;
  }

  public async getByUser(estudianteId: string): Promise<PropuestaEntity[]> {
    const getSTG = await prisma.solicitudTrabajoGrado.findFirst({
      where: {
        estudianteId,
      },
      include: {
        estudiante: true,
      },
    });

    if (!getSTG) {
      throw CustomError.internalServer(
        `No existe una solicitud registrada por el usuario`
      );
    }

    const getPropuesta = await prisma.propuesta.findFirst({
      where: {
        solicitudTrabajoGradoId: getSTG.id,
      },
      include: {
        solicitudTrabajoGrado: {
          include: {
            estudiante: true,
          },
        },
        files: true,
      },
    });

    if (getPropuesta) {
      //Crear Entidad
      const propuestaEntity = PropuestaEntity.fromObject(getPropuesta!);

      return [propuestaEntity];
    } else {
      return [];
    }
  }

  public async getByUserAprobada(
    estudianteId: string
  ): Promise<PropuestaEntity[]> {
    try {
      const getPropuesta = await prisma.propuesta.findFirst({
        where: {
          estado: "APROBADO",
        },
        include: {
          solicitudTrabajoGrado: {
            include: {
              estudiante: true,
            },
          },
          files: true,
        },
      });

      if (getPropuesta) {
        //Crear Entidad
        const propuestaEntity = PropuestaEntity.fromObject(getPropuesta!);

        return [propuestaEntity];
      } else {
        return [];
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async create(data: CreatePropuestaDTO): Promise<PropuestaEntity> {
    const {
      userId,
      cartaAceptacionDirector,
      propuestaTrabajoGrado,
      ...restData
    } = data;

    //Busco el id de la solicitud
    const STG = await this.solicitudTrabajoGradoService.getByUser(userId);

    if (!STG || STG.length === 0) {
      throw CustomError.badRequest(
        `No existe una solicitud de trabajo de grado en el usuario`
      );
    }

    //Creo la Propuesta
    const createPropuesta = await prisma.propuesta.create({
      data: {
        solicitudTrabajoGradoId: STG[0].id,
        ...restData,
      },
    });

    console.log(createPropuesta);

    try {
      // Subir archivos y crearlos
      const cartaAceptacionDirectorFile =
        await this.fileService.uploadFileToBackBlaze({
          file: cartaAceptacionDirector,
          propuestaId: createPropuesta.id,
          informeFinalId: null,
        });

      const propuestaTrabajoGradoFile =
        await this.fileService.uploadFileToBackBlaze({
          file: propuestaTrabajoGrado,
          propuestaId: createPropuesta.id,
          informeFinalId: null,
        });

      //Actualiza la Propuesta
      const updatePropuesta = await this.updateFilesPropuesta(
        createPropuesta.id,
        cartaAceptacionDirectorFile.id ?? "",
        propuestaTrabajoGradoFile.id ?? ""
      );

      return updatePropuesta;
    } catch (error) {
      /**
       * Si algo sale mal en la subida de archivos a backblaze, base de datos o actualizando
       * la propuesta con los nuevos files, se borra la propuesta
       */
      this.delete(createPropuesta.id);
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async delete(id: string) {
    return prisma.propuesta.delete({
      where: {
        id,
      },
    });
  }

  public async updateEstado(
    id: string,
    data: { estado: EstadoPropuesta }
  ): Promise<PropuestaEntity> {
    const propuestaUpdate = await prisma.propuesta.update({
      where: {
        id,
      },
      data,
      include: {
        solicitudTrabajoGrado: {
          include: {
            estudiante: true,
          },
        },
        files: true,
      },
    });

    const propuestaEntity = PropuestaEntity.fromObject(propuestaUpdate);
    return propuestaEntity;
  }

  public async update(
    id: string,
    data: UpdatePropuestaEstudianteDTO
  ): Promise<PropuestaEntity> {
    const propuestaUpdate = await prisma.propuesta.update({
      where: {
        id,
      },
      data,
      include: {
        solicitudTrabajoGrado: {
          include: {
            estudiante: true,
          },
        },
        files: true,
      },
    });

    const propuestaEntity = PropuestaEntity.fromObject(propuestaUpdate);
    return propuestaEntity;
  }

  private async updateFilesPropuesta(
    id: string,
    cartaAceptacionDirector: string,
    propuestaTrabajoGrado: string
  ): Promise<PropuestaEntity> {
    const propuestaUpdate = await prisma.propuesta.update({
      where: {
        id,
      },
      data: {
        cartaAceptacionDirector,
        propuestaTrabajoGrado,
      },
      include: {
        solicitudTrabajoGrado: {
          include: {
            estudiante: true,
          },
        },
        files: true,
      },
    });

    const propuestaEntity = PropuestaEntity.fromObject(propuestaUpdate);
    return propuestaEntity;
  }
}
