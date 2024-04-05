import { Request, Response } from "express";
import { HandleError, CreateSolicitudTrabajoGradoDTO } from "../../../domain";
import { SolicitudTrabajoGradoService } from "../../services/solicitud-trabajo-grado.service";

export class SolicitudTrabajoGradoController {
  constructor(
    private solicitudTrabajoGradoService: SolicitudTrabajoGradoService
  ) {}

  getSTG = (req: Request, res: Response) => {
    const userId = req.body.user.id;

    this.solicitudTrabajoGradoService
      .getByUser(userId)
      .then((solicitudTrabajoGrado) =>
        res.status(201).json(solicitudTrabajoGrado)
      )
      .catch((error) => HandleError.error(error, res));
  };

  createSTG = (req: Request, res: Response) => {
    const userId = req.body.user.id;

    const [error, createSTGDTO] = CreateSolicitudTrabajoGradoDTO.create({
      ...req.body,
      estudianteId: userId,
    });
    if (error) return res.status(400).json({ error });

    this.solicitudTrabajoGradoService
      .create(createSTGDTO!)
      .then((solicitudTrabajoGrado) =>
        res.status(201).json(solicitudTrabajoGrado)
      )
      .catch((error) => HandleError.error(error, res));
  };
}
