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

    router.post(
      "/estudiante",
      [
        ValidRolMiddleware.validateRol(["ESTUDIANTE"]),
        InformeFinalMiddleware.validateCreateInformeFinal,
        multerMiddleware.fields([{ name: "informeFinal", maxCount: 1 }]),
      ],
      controller.createInformeFinal
    );

    //* COMITE

    return router;
  }
}
