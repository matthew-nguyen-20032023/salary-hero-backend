import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthMessageFailed } from "src/modules/authentication/auth.const";
import { UserRepository } from "src/models/repositories/user.repository";
import { UserEntity, UserRole } from "src/models/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    public jwtService: JwtService
  ) {}

  /**
   * @description: Can be used for register for partner or worker as well
   * @param userName
   * @param email
   * @param password
   * @param role
   * @param createdUserId
   */
  public async register(
    userName: string,
    email: string,
    password: string,
    role: UserRole,
    createdUserId: number
  ): Promise<UserEntity> {
    const existUser = await this.userRepository.getUserByUserNameOrEmail([
      userName,
      email,
    ]);

    if (existUser) {
      throw new HttpException(
        { message: AuthMessageFailed.UserHasRegister },
        HttpStatus.BAD_REQUEST
      );
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_OR_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserEntity();
    newUser.username = userName;
    newUser.password = hashedPassword;
    newUser.email = email;
    newUser.role = role;
    newUser.created_by = createdUserId;
    // todo: Can add more logic such as add column code and status so that user have to verify their email to active account
    return await this.userRepository.save(newUser);
  }

  /**
   * @description: Can be used to log in by any type of user
   * @param identify can be username or email as well
   * @param password
   */
  public async login(
    identify: string,
    password: string
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.getUserByUserNameOrEmail([identify]);

    if (!user) {
      throw new HttpException(
        {
          message: AuthMessageFailed.UsernameOrPasswordIncorrect,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      throw new HttpException(
        {
          message: AuthMessageFailed.UsernameOrPasswordIncorrect,
        },
        HttpStatus.BAD_REQUEST
      );

    return {
      access_token: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }
}
