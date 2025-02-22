import B2 from "backblaze-b2";
import mime from "mime-types";
import { prisma } from "../../database";
import { UuidAdapter, envs } from "../../config";
import { CreateFileDTO, CustomError } from "../../domain";
export class FileService {
  applicationKeyId: string = envs.BACKBLAZE_APPLICATION_KEY_ID;
  applicationKey: string = envs.BACKBLAZE_APPLICATION_KEY;
  bucketId: string = envs.BACKBLAZE_BUCKET_ID;
  bucketName: string = envs.BACKBLAZE_BUCKET_NAME;

  public async getById(id: string) {
    try {
      return await prisma.file.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async create(data: CreateFileDTO) {
    try {
      return await prisma.file.create({
        data,
      });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async update(id: string, data: CreateFileDTO) {
    try {
      return await prisma.file.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async uploadFileToBackBlaze(file: Express.Multer.File) {
    //Creo el nombre del archivo en backblaze
    const extension = file.originalname.split(".").at(-1);
    const backblazeName = `${UuidAdapter.v4()}.${extension}`;

    // Autenticamos
    const b2 = new B2({
      applicationKeyId: this.applicationKeyId,
      applicationKey: this.applicationKey,
    });

    // Autorizamos
    await b2.authorize();

    // Obtenemos la URL de carga para el bucket
    const uploadUrlInfo = await b2.getUploadUrl({
      bucketId: this.bucketId,
    });

    // Obtener el tipo MIME del archivo basado en su extensión
    const mimeType =
      mime.lookup(file.originalname) || "application/octet-stream";

    // Subimos el archivo al bucket utilizando la URL de carga y el token de autorización obtenidos
    await b2.uploadFile({
      uploadUrl: uploadUrlInfo.data.uploadUrl,
      uploadAuthToken: uploadUrlInfo.data.authorizationToken,
      fileName: backblazeName,
      data: file.buffer,
      mime: mimeType,
    });

    //CrearDTO
    const [error, createFileDTO] = CreateFileDTO.create({
      name: file.originalname,
      backblazeName,
    });

    if (error) {
      throw CustomError.internalServer(
        `Error al Crear el DTO para el CreateFile`
      );
    }

    //Crear el File
    return await this.create(createFileDTO!);
  }

  public async updateFileToBackBlaze(
    fileId: string,
    file: Express.Multer.File
  ) {
    //Creo el nombre del archivo en backblaze
    const extension = file.originalname.split(".").at(-1);
    const backblazeName = `${UuidAdapter.v4()}.${extension}`;

    // Autenticamos
    const b2 = new B2({
      applicationKeyId: this.applicationKeyId,
      applicationKey: this.applicationKey,
    });

    // Autorizamos
    await b2.authorize();

    // Obtenemos la URL de carga para el bucket
    const uploadUrlInfo = await b2.getUploadUrl({
      bucketId: this.bucketId,
    });

    // Obtener el tipo MIME del archivo basado en su extensión
    const mimeType =
      mime.lookup(file.originalname) || "application/octet-stream";

    /**
     * TODO: Hacer, no va borrar los files antiguos
     */
    //Borramos el archivo anterior

    // Subimos el archivo al bucket utilizando la URL de carga y el token de autorización obtenidos
    await b2.uploadFile({
      uploadUrl: uploadUrlInfo.data.uploadUrl,
      uploadAuthToken: uploadUrlInfo.data.authorizationToken,
      fileName: backblazeName,
      data: file.buffer,
      mime: mimeType,
    });

    //CrearDTO
    const [error, createFileDTO] = CreateFileDTO.create({
      name: file.originalname,
      backblazeName,
    });

    if (error) {
      throw CustomError.internalServer(
        `Error al Crear el DTO para el CreateFile`
      );
    }

    //Crear el File
    return await this.update(fileId, createFileDTO!);
  }

  public async getFileToBackblaze(id: string) {
    // Autenticamos
    const b2 = new B2({
      applicationKeyId: this.applicationKeyId,
      applicationKey: this.applicationKey,
    });

    // Autorizamos
    await b2.authorize();

    const file = await this.getById(id);

    if (!file) {
      throw CustomError.badRequest("File not exists");
    }

    const { data: buffer } = await b2.downloadFileByName({
      bucketName: this.bucketName,
      fileName: file.backblazeName,
      responseType: "arraybuffer",
    });

    return { buffer, name: file.name };
  }

  public validateExtension(
    files: Express.Multer.File[],
    extensions: string[]
  ): boolean {
    const extensionFiles: { fielname: string; type: string }[] = [];
    const messageError: string[] = [];

    files.forEach((file) => {
      let extension: string = file.originalname.split(".").pop() || "";
      extensionFiles.push({
        fielname: file.fieldname,
        type: extension,
      });
    });

    extensionFiles.forEach((extension) => {
      if (!extensions.includes(extension.type)) {
        messageError.push(
          `El campo ${extension.fielname} tiene una extensión ${extension.type} que no es valida para el archivo`
        );
      }
    });

    if (messageError.length) {
      return false;
    } else {
      return true;
    }
  }
}
