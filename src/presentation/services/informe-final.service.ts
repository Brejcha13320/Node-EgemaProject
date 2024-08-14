import { CreateJurado, CustomError, InformeFinal } from "../../domain";
import { CreateInformeFinalDTO } from "../../domain/dtos/informe-final/create-informe-final.dto";
import { FileService } from "./file.service";
import { PropuestaService } from "./propuesta.service";
import { prisma } from "../../database";
import { UpdateEstadoInformeFinalDTO } from "../../domain/dtos/informe-final/update-estado-informe-final.dto";
import { UpdateInformeFinalDTO } from "../../domain/dtos/informe-final/update-informe-final.dto";
import { UpdateInformeFinalFileDTO } from "../../domain/dtos/informe-final/update-informe-final-file.dto";
import { UpdateComentarioJuradoDTO } from "../../domain/dtos/informe-final/update-comentario-jurado.dto";

export class InformeFinalService {
  constructor(
    private fileService: FileService,
    private propuestaService: PropuestaService
  ) {}

  public async getAll() {
    const informesFinales = await prisma.informeFinal.findMany({
      include: {
        propuesta: {
          include: {
            solicitudTrabajoGrado: {
              include: {
                estudiante: true,
              },
            },
          },
        },
        director: true,
        codirector: true,
        jurados: {
          include: {
            user: true,
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });
    return informesFinales;
  }

  public async getByUser(userId: string) {
    //Busco el id de la propuesta
    const getPropuesta = await this.propuestaService.getByUser(userId);

    if (!getPropuesta) {
      //No existe una propuesta registrada por el usuario
      return [];
    }

    const getInformeFinal = await prisma.informeFinal.findFirst({
      where: {
        propuestaId: getPropuesta[0].id,
      },
      include: {
        propuesta: {
          include: {
            solicitudTrabajoGrado: {
              include: {
                estudiante: true,
              },
            },
          },
        },
        director: true,
        codirector: true,
        jurados: {
          include: {
            user: true,
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    if (getInformeFinal) {
      return [getInformeFinal];
    } else {
      return [];
    }
  }

  public async getById(id: string) {
    const informeFinal = await prisma.informeFinal.findFirst({
      where: {
        id,
      },
      include: {
        propuesta: {
          include: {
            solicitudTrabajoGrado: {
              include: {
                estudiante: true,
              },
            },
          },
        },
        director: true,
        codirector: true,
        jurados: {
          include: {
            user: true,
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!informeFinal) {
      throw CustomError.internalServer(`No existe un informe final con ese id`);
    }

    return informeFinal;
  }

  public async update(id: string, data: UpdateInformeFinalDTO) {
    const informeFinal = await prisma.informeFinal.update({
      where: {
        id,
      },
      data,
      include: {
        propuesta: {
          include: {
            solicitudTrabajoGrado: {
              include: {
                estudiante: true,
              },
            },
          },
        },
        director: true,
        codirector: true,
        jurados: {
          include: {
            user: true,
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!informeFinal) {
      throw CustomError.internalServer(`No existe un informe final con ese id`);
    }

    return informeFinal;
  }

  public async getUsersForPrincipal() {
    const users = await prisma.user.findMany({
      where: {
        OR: [{ rol: "DOCENTE" }, { rol: "COMITE" }],
      },
    });

    const customUsers = users.map((user) => {
      const { password, ...restUser } = user;
      return restUser;
    });

    return customUsers;
  }

  public async getUsersForJurado() {
    const users = await prisma.user.findMany({
      where: {
        OR: [{ rol: "DOCENTE" }, { rol: "COMITE" }],
      },
    });

    const customUsers = users.map((user) => {
      const { password, ...restUser } = user;
      return restUser;
    });

    return customUsers;
  }

  public async create(data: CreateInformeFinalDTO) {
    const { userId, informeFinal, ...restData } = data;

    //Busco el id de la propuesta
    const propuesta = await this.propuestaService.getByUser(userId);

    if (!propuesta || propuesta.length === 0) {
      throw CustomError.badRequest(
        `No existe una propuesta de trabajo de grado en el usuario`
      );
    }

    //Creo el Informe Final
    const createInformeFinal = await prisma.informeFinal.create({
      data: {
        propuestaId: propuesta[0].id,
        ...restData,
      },
    });

    try {
      // Subir archivos y crearlos
      const informeFinalFile = await this.fileService.uploadFileToBackBlaze(
        informeFinal
      );

      //Creo los Registros en PropuestaFiles
      await prisma.informeFinalFile.createMany({
        data: [
          {
            informeFinalId: createInformeFinal.id,
            fileId: informeFinalFile.id,
            tipo: "INFORME_FINAL",
          },
        ],
      });

      return await this.getById(createInformeFinal.id);
    } catch (error) {
      /**
       * Si algo sale mal en la subida de archivos a backblaze, base de datos o actualizando
       * la propuesta con los nuevos files, se borra la propuesta
       */
      this.delete(createInformeFinal.id);
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async delete(id: string) {
    return prisma.informeFinal.delete({
      where: {
        id,
      },
    });
  }

  public async getJuradosByInformeFinalId(informeFinalId: string) {
    const jurados = await prisma.jurado.findMany({
      where: {
        informeFinalId,
      },
      include: {
        user: true,
      },
    });
    return jurados;
  }

  public async createJuradosInformeFinal(
    informeFinalId: string,
    data: CreateJurado[]
  ) {
    //Eliminar Jurados Existentes
    await this.deleteJuradosFromInformeFinal(informeFinalId);

    await prisma.jurado.createMany({
      data,
    });

    return this.getJuradosByInformeFinalId(informeFinalId);
  }

  public async deleteJuradosFromInformeFinal(informeFinalId: string) {
    return await prisma.jurado.deleteMany({
      where: {
        informeFinalId,
      },
    });
  }

  public async updateEstadoInformeFinal(
    informeFinalId: string,
    data: UpdateEstadoInformeFinalDTO
  ) {
    return await prisma.informeFinal.update({
      where: {
        id: informeFinalId,
      },
      data,
    });
  }

  public async updateInformeFinalFile(
    id: string,
    data: UpdateInformeFinalFileDTO
  ): Promise<InformeFinal | any> {
    //Obtener el propuestaFile
    const informeFinalFile = await prisma.informeFinalFile.findFirst({
      where: {
        id: data.informeFinalFileId,
      },
    });

    if (!informeFinalFile) {
      throw CustomError.badRequest(
        `No existe un archivo en el informe final con el id ${data.informeFinalFileId}`
      );
    }

    try {
      // Subir archivos y crearlos
      await this.fileService.updateFileToBackBlaze(
        informeFinalFile.fileId,
        data.file
      );

      return await this.getById(id);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getJuradoInformesFinales(userId: string) {
    return await prisma.jurado.findMany({
      where: {
        userId,
      },
      include: {
        informeFinal: {
          include: {
            propuesta: {
              include: {
                solicitudTrabajoGrado: {
                  include: {
                    estudiante: true,
                  },
                },
              },
            },
            director: true,
            codirector: true,
            jurados: {
              include: {
                user: true,
              },
            },
            files: {
              include: {
                file: true,
              },
            },
          },
        },
      },
    });
  }

  public async getJuradoById(id: string) {
    return await prisma.jurado.findFirst({
      where: {
        id,
      },
    });
  }

  public async updateComentarioJurado(
    id: string,
    data: UpdateComentarioJuradoDTO
  ) {
    return await prisma.jurado.update({
      where: {
        id,
      },
      data,
    });
  }
}
