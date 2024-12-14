import { Router } from "express";
import { ProductController } from "./controller";
import { AuthMiddleware } from "../middlewares";
import { ProductService } from "../services";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();

    const productService = new ProductService();
    const controller = new ProductController(productService);

    // Definir las rutas
    router.use(AuthMiddleware.validateJwt);
    router.get("/", controller.getProducts);
    router.post("/", controller.createProduct);

    return router;
  }
}
