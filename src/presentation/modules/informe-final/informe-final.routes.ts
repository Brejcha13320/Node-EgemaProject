import { Router } from "express";
import { AuthMiddleware, ValidRolMiddleware } from "../../middlewares";
import { FileService } from "../../services/file.service";
import { InformeFinalService } from "../../services/informe-final.service";
import multerMiddleware from "../../middlewares/multer.middleware";
import { InformeFinalController } from "./informe-final.controller";
import { InformeFinalMiddleware } from "../../middlewares/informe-final.middleware";
import { PropuestaService } from "../../services/propuesta.service";
import { SolicitudTrabajoGradoService } from "../../services/solicitud-trabajo-grado.service";

export class InformeFinalRoutes {
  static get routes(): Router {
    const router = Router();

    const fileService = new FileService();
    const solicitudTrabajoGradoService = new SolicitudTrabajoGradoService();
    const propuestaService = new PropuestaService(
      fileService,
      solicitudTrabajoGradoService
    );
    const informeFinalService = new InformeFinalService(
      fileService,
      propuestaService
    );

    const controller = new InformeFinalController(informeFinalService);

    //Middlewares Para Todas las Rutas
    router.use([AuthMiddleware.validateToken]);

    // Definir las rutas

    //* ESTUDIANTE

    router.get(
      "/estudiante",
      [ValidRolMiddleware.validateRol(["ESTUDIANTE"])],
      controller.getInformeFinal
    );

    router.get(
      "/estudiante/:id",
      [ValidRolMiddleware.validateRol(["ESTUDIANTE"])],
      controller.getInformeFinalById
    );

    router.get(
      "/estudiante/usuarios/director",
      [ValidRolMiddleware.validateRol(["ESTUDIANTE"])],
      controller.getUsuariosDirector
    );

    router.post(
      "/estudiante",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        InformeFinalMiddleware.validateCreateInformeFinal,
        multerMiddleware.fields([{ name: "informeFinal", maxCount: 1 }]),
      ],
      controller.createInformeFinal
    );

    router.put(
      "/estudiante/:id",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        InformeFinalMiddleware.validateUpdateInformeFinal,
      ],
      controller.updateInformeFinal
    );

    router.put(
      "/estudiante/file/:id",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        InformeFinalMiddleware.validateUpdateInformeFinal,
        multerMiddleware.fields([{ name: "file", maxCount: 1 }]),
      ],
      controller.updateInformeFinalFile
    );

    router.put(
      "/estudiante/pendiente/:id",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        InformeFinalMiddleware.validateUpdateInformeFinal,
      ],
      controller.updateEstadoPendienteInformeFinal
    );

    //* COMITE

    router.get(
      "/comite",
      [ValidRolMiddleware.validateRol(["COMITE"])],
      controller.getInformesFinales
    );

    router.get(
      "/comite/:id",
      [ValidRolMiddleware.validateRol(["COMITE"])],
      controller.getInformeFinalById
    );

    router.get(
      "/comite/jurado/:id",
      [ValidRolMiddleware.validateRol(["COMITE"])],
      controller.getJuradosByInformeFinalId
    );

    router.get(
      "/comite/usuarios/jurado",
      [ValidRolMiddleware.validateRol(["COMITE"])],
      controller.getUsuariosJurado
    );

    router.post(
      "/comite/jurado",
      [
        ValidRolMiddleware.validateRol(["COMITE"]),
        InformeFinalMiddleware.createJuradosInformeFinal,
      ],
      controller.createJurados
    );

    router.put(
      "/comite/estado/:id",
      [ValidRolMiddleware.validateRol(["COMITE"])],
      controller.updateEstadoInformeFinal
    );

    return router;
  }
}
