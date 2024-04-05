import { Router } from "express";
import { AuthMiddleware } from "../../middlewares";
import { FileService } from "../../services/file.service";
import { FileController } from "./file.controller";

export class FileRoutes {
  static get routes(): Router {
    const router = Router();

    const fileService = new FileService();
    const controller = new FileController(fileService);

    // Definir las rutas
    router.get("/:token/:id", controller.getFile);

    return router;
  }
}
