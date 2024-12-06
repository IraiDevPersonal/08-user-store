import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { EmailService, SendMailOptions } from "./email.service";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) {
      throw CustomError.badRequest("Email already exist");
    }

    const isSent = await this.sendEmailValidationToken(registerUserDto.email);

    if (!isSent) {
      throw CustomError.internalServer("Error sending email, user not created");
    }

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();

      const { password, ...restUser } = UserEntity.fromObject(user);
      const token = await this.generateUserToken(restUser);

      return { user: restUser, token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });

    this.notAuthenticated(user);

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user!.password!
    );

    this.notAuthenticated(isMatching);

    const { password, ...restUser } = UserEntity.fromObject(user!);
    const token = await this.generateUserToken(restUser);

    return { user: restUser, token };
  }

  public async validateEmail(token: string) {
    const payload = await JwtAdapter.validateToken(token);

    if (!payload) {
      throw CustomError.unautorized("Invalid token");
    }

    const { email } = payload as { email: string };
    if (!email) {
      throw CustomError.internalServer("Email not in token");
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw CustomError.internalServer("Email not exist");
    }

    user.emailValidated = true;
    await user.save();
    return true;
  }

  // PRIVATE METHODS

  private notAuthenticated(evaluate: any) {
    if (!evaluate) {
      throw CustomError.badRequest("Email or password is incorrect");
    }
  }

  private generateUserToken = async (user: Partial<UserEntity>) => {
    const token = await JwtAdapter.generateToken({
      id: user.id,
    });

    if (!token) {
      throw CustomError.internalServer("Error while creating JWT");
    }

    return token as string;
  };

  private sendEmailValidationToken = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });

    if (!token) {
      throw CustomError.internalServer("Error getting token");
    }

    const link = `${envs.WEBSERVICE_UTL}/auth/validate-email/${token}`;
    const htmlBody = `
      <h1>Validate your Email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your Email</a>
    `;

    const options: SendMailOptions = {
      htmlBody,
      to: email,
      subject: "Validate your Email",
    };

    const isSent = await this.emailService.sendEmail(options);

    return isSent;
  };
}
