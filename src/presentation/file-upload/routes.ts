import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload.service";
import {
  AuthMiddleware,
  FileUploadMiddleware,
  TypeMiddleware,
} from "../middlewares";

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();

    const service = new FileUploadService();
    const controller = new FileUploadController(service);

    // estos middlewares se aplica a todas las rutas que estan mas abajo
    router.use(AuthMiddleware.validateJwt);
    router.use(FileUploadMiddleware.containFile);
    router.use(TypeMiddleware.validTypes(["users", "products", "categories"]));
    // api/upload<user|category\product>
    // api/upload/single<user|category\product>
    // api/upload/multiple<user|category\product>
    router.post("/single/:type", controller.uploadSingleFile);
    router.post("/multiple/:type", controller.uploadMultipleFile);

    return router;
  }
}
