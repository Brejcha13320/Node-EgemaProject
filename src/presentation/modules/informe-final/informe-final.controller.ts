import { Request, Response } from "express";
import { InformeFinalService } from "../../services/informe-final.service";
import { CreateInformeFinalDTO } from "../../../domain/dtos/informe-final/create-informe-final.dto";
import { HandleError } from "../../../domain";

export class InformeFinalController {
  constructor(private informeFinalService: InformeFinalService) {}

  //* GLOBAL

  //* ESTUDIANTE

  getInformeFinal = (req: Request, res: Response) => {
    const userId = req.body.user.id;

    this.informeFinalService
      .getByUser(userId)
      .then((informeFinal) => res.status(201).json(informeFinal))
      .catch((error) => HandleError.error(error, res));
  };

  getInformeFinalById = (req: Request, res: Response) => {
    const id = req.params.id;

    this.informeFinalService
      .getById(id)
      .then((informeFinal) => res.status(201).json(informeFinal))
      .catch((error) => HandleError.error(error, res));
  };

  getUsuariosDirector = (req: Request, res: Response) => {
    this.informeFinalService
      .getUsersForPrincipal()
      .then((users) => res.status(201).json(users))
      .catch((error) => HandleError.error(error, res));
  };

  createInformeFinal = (req: Request, res: Response) => {
    const [error, createInformeFinalDTO] = CreateInformeFinalDTO.create(
      req.body,
      req.files
    );
    if (error) return res.status(400).json({ error });

    this.informeFinalService
      .create(createInformeFinalDTO!)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  //* COMITE
}
