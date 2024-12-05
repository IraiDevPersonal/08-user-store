import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";

export class AuthService {
  constructor() {}

  private notAuthenticated(evaluate: any) {
    if (!evaluate) {
      throw CustomError.badRequest("Email or password is incorrect");
    }
  }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) {
      throw CustomError.badRequest("Email already exist");
    }

    try {
      const user = new UserModel(registerUserDto);

      // encriptar password
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();
      // JWT <----- para mantener la autenticacion del usuario
      // Email de confirmacion

      const { password, ...restUser } = UserEntity.fromObject(user);
      return { user: restUser, token: "abc" };
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
    const token = await JwtAdapter.generateToken({
      id: user?.id,
      email: user?.email,
    });

    if (!token) {
      throw CustomError.internalServer("Error while creating JWT");
    }

    return { user: restUser, token };
  }
}
