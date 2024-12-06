import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares";
import { CategoryService } from "../services";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();

    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    // Definir las rutas
    router.get("/", controller.getCategories);
    router.post("/", [AuthMiddleware.validateJwt], controller.createCategory);

    return router;
  }
}
