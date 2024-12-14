import { Router } from "express";
import { ImagesController } from "./controller";
import { AuthMiddleware } from "../middlewares";

export class ImagesRoutes {
  static get routes(): Router {
    const router = Router();

    const controller = new ImagesController();

    router.use(AuthMiddleware.validateJwt);
    router.get("/:type/:img", controller.getImage);

    return router;
  }
}
