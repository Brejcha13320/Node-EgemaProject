import { Request, Response } from "express";
import { InformeFinalService } from "../../services/informe-final.service";
import { CreateInformeFinalDTO } from "../../../domain/dtos/informe-final/create-informe-final.dto";
import { HandleError } from "../../../domain";
import { CreateJurado } from "../../../domain/interfaces/informe-final.interface";
import { UpdateEstadoInformeFinalDTO } from "../../../domain/dtos/informe-final/update-estado-informe-final.dto";
import { UpdateInformeFinalDTO } from "../../../domain/dtos/informe-final/update-informe-final.dto";
import { UpdateInformeFinalFileDTO } from "../../../domain/dtos/informe-final/update-informe-final-file.dto";
import { UpdateEstadoPendienteInformeFinalDTO } from "../../../domain/dtos/informe-final/update-estado-pendiente-informe-final.dto";

export class InformeFinalController {
  constructor(private informeFinalService: InformeFinalService) {}

  //* GLOBAL

  getInformeFinalById = (req: Request, res: Response) => {
    const id = req.params.id;

    this.informeFinalService
      .getById(id)
      .then((informeFinal) => res.status(201).json(informeFinal))
      .catch((error) => HandleError.error(error, res));
  };

  //* ESTUDIANTE

  getInformeFinal = (req: Request, res: Response) => {
    const userId = req.body.user.id;

    this.informeFinalService
      .getByUser(userId)
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

  updateInformeFinal = (req: Request, res: Response) => {
    const id = req.params.id;
    const [error, updateInformeFinalDTO] = UpdateInformeFinalDTO.create(
      req.body
    );
    if (error) return res.status(400).json({ error });

    this.informeFinalService
      .update(id, updateInformeFinalDTO!)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  updateInformeFinalFile = (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, updateInformeFinalFileDTO] = UpdateInformeFinalFileDTO.create(
      req.body,
      req.files
    );

    if (error) return res.status(400).json({ error });

    this.informeFinalService
      .updateInformeFinalFile(id, updateInformeFinalFileDTO!)
      .then((informeFinal) => res.status(201).json(informeFinal))
      .catch((error) => HandleError.error(error, res));
  };

  updateEstadoPendienteInformeFinal = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateEstadoPendienteInformeFinalDTO] =
      UpdateEstadoPendienteInformeFinalDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    this.informeFinalService
      .updateEstadoInformeFinal(id, { estado: "PENDIENTE" })
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  //* COMITE

  getInformesFinales = (req: Request, res: Response) => {
    this.informeFinalService
      .getAll()
      .then((informesFinales) => res.status(201).json(informesFinales))
      .catch((error) => HandleError.error(error, res));
  };

  getJuradosByInformeFinalId = (req: Request, res: Response) => {
    const id = req.params.id;
    this.informeFinalService
      .getJuradosByInformeFinalId(id)
      .then((informesFinales) => res.status(201).json(informesFinales))
      .catch((error) => HandleError.error(error, res));
  };

  getUsuariosJurado = (req: Request, res: Response) => {
    this.informeFinalService
      .getUsersForJurado()
      .then((users) => res.status(201).json(users))
      .catch((error) => HandleError.error(error, res));
  };

  createJurados = (req: Request, res: Response) => {
    const jurados = req.body as CreateJurado[];
    this.informeFinalService
      .createJuradosInformeFinal(jurados[0].informeFinalId, jurados)
      .then((users) => res.status(201).json(users))
      .catch((error) => HandleError.error(error, res));
  };

  updateEstadoInformeFinal = (req: Request, res: Response) => {
    const id = req.params.id;
    const [error, updateEstadoInformeFinalDTO] =
      UpdateEstadoInformeFinalDTO.create(req.body);
    if (error) return res.status(400).json({ error });

    this.informeFinalService
      .updateEstadoInformeFinal(id, updateEstadoInformeFinalDTO!)
      .then((users) => res.status(201).json(users))
      .catch((error) => HandleError.error(error, res));
  };
}
