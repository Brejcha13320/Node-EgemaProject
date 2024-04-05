import { OpcionSolicitudTrabajoGrado } from "../../interfaces/solicitud-trabajo-grado.interface";

export class CreateSolicitudTrabajoGradoDTO {
  private constructor(
    public readonly estudianteId: string,
    public readonly opcion: OpcionSolicitudTrabajoGrado
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, CreateSolicitudTrabajoGradoDTO?] {
    const { estudianteId, opcion } = object;
    const opciones: OpcionSolicitudTrabajoGrado[] = [
      "ESPECIALIZACION",
      "INVESTIGACION",
      "PRUEBAS_SABER_PRO",
      "TRABAJO_GRADO",
    ];

    if (!estudianteId) return ["Missing estudianteId"];
    if (!opcion) return ["Missing opcion"];
    if (!opciones.includes(opcion)) return ["Invalid opcion"];

    return [
      undefined,
      new CreateSolicitudTrabajoGradoDTO(estudianteId, opcion),
    ];
  }
}
