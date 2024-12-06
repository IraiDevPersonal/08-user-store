import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService, EmailService } from "../services";
import { envs } from "../../config";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      {
        mailerEmail: envs.MAILER_EMAIL,
        mailerService: envs.MAILER_SERVICE,
        senderEmailPassword: envs.MAILER_SECRET_KEY,
      },
      envs.SEND_EMAIL
    );
    const authService = new AuthService(emailService);
    const controller = new AuthController(authService);

    // Definir las rutas
    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);
    router.get("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
