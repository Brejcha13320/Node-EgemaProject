import { CustomError } from "../errors/custom-errors";

export class FileEntity {
  constructor(
    public id: string,
    public propuestaId: string | null,
    public informeFinalId: string | null,
    public backblazeName: string,
    public name: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromObject(object: { [key: string]: any }) {
    let {
      id,
      propuestaId,
      informeFinalId,
      backblazeName,
      name,
      createdAt,
      updatedAt,
    } = object;

    if (!id) throw CustomError.badRequest("Missing id");
    if (!backblazeName) throw CustomError.badRequest("Missing backblazeName");
    if (!name) throw CustomError.badRequest("Missing name");
    if (!createdAt) throw CustomError.badRequest("Missing createdAt");
    if (!updatedAt) throw CustomError.badRequest("Missing updatedAt");

    return new FileEntity(
      id,
      propuestaId,
      informeFinalId,
      backblazeName,
      name,
      createdAt,
      updatedAt
    );
  }
}
