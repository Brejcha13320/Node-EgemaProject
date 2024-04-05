import { Router } from "express";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { SolicitudTrabajoGradoRoutes } from "./modules/solicitud-trabajo-grado/solicitud-trabajo-grado.routes";
import { PropuestaRoutes } from "./modules/propuesta/propuesta.routes";
import { FileRoutes } from "./modules/file/file.routes";
import { InformeFinalRoutes } from "./modules/informe-final/informe-final.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    //Definir Rutas
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/file", FileRoutes.routes);
    router.use(
      "/api/solicitud-trabajo-grado",
      SolicitudTrabajoGradoRoutes.routes
    );
    router.use("/api/propuesta", PropuestaRoutes.routes);
    router.use("/api/informe-final", InformeFinalRoutes.routes);

    return router;
  }
}
