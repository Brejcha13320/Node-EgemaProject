import { Request, Response } from "express";
import { HandleError, UpdateEstadoPropuestaDTO } from "../../../domain";
import { PropuestaService } from "../../services/propuesta.service";
import { CreatePropuestaDTO } from "../../../domain/dtos/propuesta/create-propuesta.dto";
import { UpdatePropuestaDTO } from "../../../domain/dtos/propuesta/update-propuesta.dto";
import { UpdatePropuestaFileDTO } from "../../../domain/dtos/propuesta/update-propuesta-file.dto";
import { UpdateEstadoPendientePropuestaDTO } from "../../../domain/dtos/propuesta/update-estado-pendiente-propuesta.dto";

export class PropuestaController {
  constructor(private propuestaService: PropuestaService) {}

  //* GLOBAL

  getPropuestaById = (req: Request, res: Response) => {
    const id = req.params.id;

    this.propuestaService
      .getById(id)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  //* ESTUDIANTE

  getPropuesta = (req: Request, res: Response) => {
    const userId = req.body.user.id;

    this.propuestaService
      .getByUser(userId)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  getPropuestaAprobada = (req: Request, res: Response) => {
    const userId = req.body.user.id;

    this.propuestaService
      .getByUserAprobada(userId)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  createPropuesta = (req: Request, res: Response) => {
    const [error, createPropuestaDTO] = CreatePropuestaDTO.create(
      req.body,
      req.files
    );
    if (error) return res.status(400).json({ error });

    this.propuestaService
      .create(createPropuestaDTO!)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  updatePropuesta = (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, updatePropuestaDTO] = UpdatePropuestaDTO.create(req.body);
    if (error) return res.status(400).json({ error });

    this.propuestaService
      .update(id, updatePropuestaDTO!)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  updatePropuestaFile = (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, updatePropuestaFileDTO] = UpdatePropuestaFileDTO.create(
      req.body,
      req.files
    );

    if (error) return res.status(400).json({ error });

    this.propuestaService
      .updatePropuestaFile(id, updatePropuestaFileDTO!)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  updateEstadoPendientePropuesta = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateEstadoPendientePropuestaDTO] =
      UpdateEstadoPendientePropuestaDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    this.propuestaService
      .updateEstado(id, updateEstadoPendientePropuestaDTO!)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  //* COMITE

  getPropuestas = (req: Request, res: Response) => {
    this.propuestaService
      .getAll()
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };

  updateEstadoPropuesta = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateEstadoPropuestaDTO] = UpdateEstadoPropuestaDTO.create(
      req.body
    );

    if (error) return res.status(400).json({ error });

    this.propuestaService
      .updateEstado(id, updateEstadoPropuestaDTO!)
      .then((propuesta) => res.status(201).json(propuesta))
      .catch((error) => HandleError.error(error, res));
  };
}
