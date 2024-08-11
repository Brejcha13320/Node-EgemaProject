import { CustomError, InformeFinal } from "../../domain";
import { CreateInformeFinalDTO } from "../../domain/dtos/informe-final/create-informe-final.dto";
import { FileService } from "./file.service";
import { SolicitudTrabajoGradoService } from "./solicitud-trabajo-grado.service";
import { PropuestaService } from "./propuesta.service";
import { prisma } from "../../database";

export class InformeFinalService {
  constructor(
    private fileService: FileService,
    private propuestaService: PropuestaService
  ) {}

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

  public async getUsersForPrincipal() {
    const users = await prisma.user.findMany({
      where: {
        OR: [{ rol: "DOCENTE" }],
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

  // revisar

  private async updateFilesInformeFinal(
    id: string,
    informeFinal: string
  ): Promise<InformeFinal> {
    const informeFinalUpdate = await prisma.informeFinal.update({
      where: {
        id,
      },
      data: {
        // informeFinal,
      },
      include: {
        files: true,
      },
    });

    console.log(informeFinalUpdate);

    return informeFinalUpdate as any;
  }
}
