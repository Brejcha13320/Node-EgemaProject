import { Router } from "express";
import { SolicitudTrabajoGradoService } from "../../services/solicitud-trabajo-grado.service";
import { SolicitudTrabajoGradoController } from "./solicitud-trabajo-grado.controller";
import {
  AuthMiddleware,
  SolicitudTrabajoGradoMiddleware,
  ValidRolMiddleware,
} from "../../middlewares";

export class SolicitudTrabajoGradoRoutes {
  static get routes(): Router {
    const router = Router();

    const solicitudTrabajoGradoService = new SolicitudTrabajoGradoService();
    const controller = new SolicitudTrabajoGradoController(
      solicitudTrabajoGradoService
    );

    //Middlewares Para Todas las Rutas
    router.use([AuthMiddleware.validateToken]);

    // Definir las rutas

    //* ESTUDIANTE

    router.get(
      "/estudiante",
      [ValidRolMiddleware.validateRol(["ESTUDIANTE"])],
      controller.getSTG
    );

    router.post(
      "/estudiante",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        SolicitudTrabajoGradoMiddleware.validateCreateSTG,
      ],
      controller.createSTG
    );

    return router;
  }
}
