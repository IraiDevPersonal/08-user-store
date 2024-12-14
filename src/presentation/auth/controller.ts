import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.authService
      .registerUser(registerDto!)
      .then((user) => res.json(user))
      .catch((error) => CustomError.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginDto] = LoginUserDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.authService
      .loginUser(loginDto!)
      .then((user) => res.json(user))
      .catch((error) => CustomError.handleError(error, res));
  };

  renewUser = (req: Request, res: Response) => {
    const { id = "" } = req.body.user;

    this.authService
      .renewUser(id)
      .then((user) => res.json(user))
      .catch((error) => CustomError.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;

    this.authService
      .validateEmail(token)
      .then(() => res.json("Email was validated properly"))
      .catch((error) => CustomError.handleError(error, res));
  };
}
