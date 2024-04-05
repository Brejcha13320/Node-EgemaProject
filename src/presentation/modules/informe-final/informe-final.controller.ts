import { Request, Response } from "express";
import { PropuestaService } from "../../services/propuesta.service";
import { InformeFinalService } from "../../services/informe-final.service";
import { CreateInformeFinalDTO } from "../../../domain/dtos/informe-final/create-informe-final.dto";
import { HandleError } from "../../../domain";

export class InformeFinalController {
  constructor(private informeFinalService: InformeFinalService) {}

  //* GLOBAL

  //* ESTUDIANTE

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
