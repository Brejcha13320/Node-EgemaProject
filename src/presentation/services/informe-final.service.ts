import { CustomError, InformeFinalEntity } from "../../domain";
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

  public async create(data: CreateInformeFinalDTO): Promise<any> {
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
      const informeFinalFile = await this.fileService.uploadFileToBackBlaze({
        file: informeFinal,
        propuestaId: null,
        informeFinalId: createInformeFinal.id,
      });

      //Actualiza el Informe Final
      const updateInformeFinal = await this.updateFilesInformeFinal(
        createInformeFinal.id,
        informeFinalFile.id ?? ""
      );

      return updateInformeFinal;
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

  private async updateFilesInformeFinal(
    id: string,
    informeFinal: string
  ): Promise<InformeFinalEntity> {
    const informeFinalUpdate = await prisma.informeFinal.update({
      where: {
        id,
      },
      data: {
        informeFinal,
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
        files: true,
      },
    });

    console.log(informeFinalUpdate);
    const informeFinalEntity =
      InformeFinalEntity.fromObject(informeFinalUpdate);

    return informeFinalEntity;
  }
}
