import { prisma } from "../../database";
import { CustomError, EstadoPropuesta, Propuesta } from "../../domain";
import { CreatePropuestaDTO } from "../../domain/dtos/propuesta/create-propuesta.dto";
import { FileService } from "./file.service";
import { SolicitudTrabajoGradoService } from "./solicitud-trabajo-grado.service";
import { UpdatePropuestaEstudianteDTO } from "../../domain/dtos/propuesta/update-propuesta-estudiante.dto";
import { UpdatePropuestaFileEstudianteDTO } from "../../domain/dtos/propuesta/update-propuesta-file-estudiante.dto";

export class PropuestaService {
  constructor(
    private fileService: FileService,
    private solicitudTrabajoGradoService: SolicitudTrabajoGradoService
  ) {}

  public async getAll(): Promise<Propuesta[]> {
    const propuestas = await prisma.propuesta.findMany({
      include: {
        solicitudTrabajoGrado: {
          include: {
            estudiante: true,
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });
    return propuestas as Propuesta[];
  }

  public async getById(id: string) {
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
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!propuesta) {
      throw CustomError.internalServer(`No existe una propuesta con ese id`);
    }

    return propuesta;
  }

  public async getByUser(estudianteId: string) {
    const getSTG = await prisma.solicitudTrabajoGrado.findFirst({
      where: {
        estudianteId,
      },
      include: {
        estudiante: true,
      },
    });

    if (!getSTG) {
      //No existe una solicitud registrada por el usuario
      return [];
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
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    if (getPropuesta) {
      return [getPropuesta];
    } else {
      return [];
    }
  }

  public async getByUserAprobada(estudianteId: string): Promise<Propuesta[]> {
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
          files: {
            include: {
              file: true,
            },
          },
        },
      });

      if (getPropuesta) {
        return [getPropuesta as Propuesta];
      } else {
        return [];
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async create(data: CreatePropuestaDTO) {
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

    try {
      // Subir archivos y crearlos
      const cartaAceptacionDirectorFile =
        await this.fileService.uploadFileToBackBlaze(cartaAceptacionDirector);

      const propuestaTrabajoGradoFile =
        await this.fileService.uploadFileToBackBlaze(propuestaTrabajoGrado);

      //Creo los Registros en PropuestaFiles
      await prisma.propuestaFile.createMany({
        data: [
          {
            propuestaId: createPropuesta.id,
            fileId: cartaAceptacionDirectorFile.id,
            // tipo: "CARTA_ACEPTACION_DIRECTOR",
            tipo: "CARTA_ACEPTACION_DIRECTOR",
          },
          {
            propuestaId: createPropuesta.id,
            fileId: propuestaTrabajoGradoFile.id,
            tipo: "PROPUESTA_TRABAJO_GRADO",
          },
        ],
      });

      return await this.getById(createPropuesta.id);
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
  ): Promise<Propuesta> {
    const propuesta = await prisma.propuesta.update({
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
        files: {
          include: {
            file: true,
          },
        },
      },
    });
    return propuesta as Propuesta;
  }

  public async update(
    id: string,
    data: UpdatePropuestaEstudianteDTO
  ): Promise<Propuesta> {
    const propuesta = await prisma.propuesta.update({
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
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    return propuesta as Propuesta;
  }

  public async updatePropuestaFile(
    id: string,
    data: UpdatePropuestaFileEstudianteDTO
  ): Promise<Propuesta | any> {
    //Obtener el propuestaFile
    const propuestFile = await prisma.propuestaFile.findFirst({
      where: {
        id: data.propuestaFileId,
      },
    });

    if (!propuestFile) {
      throw CustomError.badRequest(
        `No existe un archivo en la propuesta con el id ${data.propuestaFileId}`
      );
    }

    try {
      // Subir archivos y crearlos
      await this.fileService.updateFileToBackBlaze(
        propuestFile.fileId,
        data.file
      );

      return await this.getById(id);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
