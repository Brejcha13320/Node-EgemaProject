import { Router } from "express";
import {
  AuthMiddleware,
  PropuestaMiddleware,
  ValidRolMiddleware,
} from "../../middlewares";
import { PropuestaService } from "../../services/propuesta.service";
import { PropuestaController } from "./propuesta.controller";
import { FileService } from "../../services/file.service";
import { SolicitudTrabajoGradoService } from "../../services/solicitud-trabajo-grado.service";
import multerMiddleware from "../../middlewares/multer.middleware";

export class PropuestaRoutes {
  static get routes(): Router {
    const router = Router();

    const fileService = new FileService();
    const solicitudTrabajoGradoService = new SolicitudTrabajoGradoService();
    const propuestaService = new PropuestaService(
      fileService,
      solicitudTrabajoGradoService
    );
    const controller = new PropuestaController(propuestaService);

    //Middlewares Para Todas las Rutas
    router.use([AuthMiddleware.validateToken]);

    // Definir las rutas

    //* ESTUDIANTE

    router.get(
      "/estudiante",
      [ValidRolMiddleware.validateRol(["ESTUDIANTE"])],
      controller.getPropuesta
    );

    router.get(
      "/estudiante/aprobada",
      [ValidRolMiddleware.validateRol(["ESTUDIANTE"])],
      controller.getPropuestaAprobada
    );

    router.get(
      "/estudiante/:id",
      [ValidRolMiddleware.validateRol(["ESTUDIANTE"])],
      controller.getPropuestaById
    );

    router.post(
      "/estudiante",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        PropuestaMiddleware.validateCreatePropuesta,
        multerMiddleware.fields([
          { name: "cartaAceptacionDirector", maxCount: 1 },
          { name: "propuestaTrabajoGrado", maxCount: 1 },
        ]),
      ],
      controller.createPropuesta
    );

    router.put(
      "/estudiante/:id",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        PropuestaMiddleware.validateUpdatePropuestaEstudiante,
      ],
      controller.updatePropuesta
    );

    router.put(
      "/estudiante/file/:id",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        PropuestaMiddleware.validateUpdatePropuestaEstudiante,
        multerMiddleware.fields([{ name: "file", maxCount: 1 }]),
      ],
      controller.updatePropuestaFile
    );

    router.put(
      "/estudiante/pendiente/:id",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        PropuestaMiddleware.validateExistsPropuesta,
      ],
      controller.updateEstadoPendientePropuesta
    );

    //* COMITE

    router.get(
      "/comite",
      [ValidRolMiddleware.validateRol(["COMITE"])],
      controller.getPropuestas
    );

    router.get(
      "/comite/:id",
      [ValidRolMiddleware.validateRol(["COMITE"])],
      controller.getPropuestaById
    );

    router.put(
      "/comite/:id",
      [
        ValidRolMiddleware.validateRol(["COMITE"]),
        PropuestaMiddleware.validateExistsPropuesta,
      ],
      controller.updateEstadoPropuesta
    );

    return router;
  }
}
