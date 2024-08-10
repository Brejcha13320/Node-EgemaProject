import { prisma } from "../../database";
import { CustomError, EstadoPropuesta, Propuesta } from "../../domain";
import { CreatePropuestaDTO } from "../../domain/dtos/propuesta/create-propuesta.dto";
import { FileService } from "./file.service";
import { SolicitudTrabajoGradoService } from "./solicitud-trabajo-grado.service";
import { UpdatePropuestaEstudianteDTO } from "../../domain/dtos/propuesta/update-propuesta-estudiante.dto";

export class PropuestaService {
  constructor(
    private fileService: FileService,
    private solicitudTrabajoGradoService: SolicitudTrabajoGradoService
  ) {}

  public async getAll(): Promise<Propuesta[]> {
    const propuestas = await prisma.propuesta.findMany({
      include: {
        files: true,
      },
    });
    return propuestas as Propuesta[];
  }

  public async getById(id: string): Promise<Propuesta> {
    const propuesta = await prisma.propuesta.findFirst({
      where: {
        id,
      },
      include: {
        files: true,
      },
    });

    if (!propuesta) {
      throw CustomError.internalServer(`No existe una propuesta con ese id`);
    }

    return propuesta as Propuesta;
  }

  public async getByUser(estudianteId: string): Promise<Propuesta[]> {
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
        files: true,
      },
    });

    if (getPropuesta) {
      return [getPropuesta as Propuesta];
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
          files: true,
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

  /**
   *
   * FIXME: Esto se va estallar
   */
  public async create(data: CreatePropuestaDTO): Promise<Propuesta> {
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

  /**
   * TODO: revisar si esta retornando el objeto u otro dato y tipar
   */
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
        files: true,
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
        files: true,
      },
    });

    return propuesta as Propuesta;
  }

  /**
   * FIXME: esto se va estallar
   */
  private async updateFilesPropuesta(
    id: string,
    cartaAceptacionDirector: string,
    propuestaTrabajoGrado: string
  ): Promise<Propuesta> {
    const propuesta = await prisma.propuesta.update({
      where: {
        id,
      },
      data: {
        // cartaAceptacionDirector,
        // propuestaTrabajoGrado,
      },
      include: {
        files: true,
      },
    });

    return propuesta as Propuesta;
  }
}
