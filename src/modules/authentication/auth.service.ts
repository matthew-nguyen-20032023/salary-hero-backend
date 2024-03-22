import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity, UserRole } from "src/models/entities/user.entity";
import { UserRepository } from "src/models/repositories/user.repository";
import { AuthMessageFailed } from "src/modules/authentication/auth.const";

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
    // TODO: Can add more logic such as add column code and status so that user have to verify their email to active account
    return await this.userRepository.save(newUser);
  }

  /**
   * @description: Can be used to log in by any type of user
   * @param identify can be username or email as well
   * @param password
   */
  // TODO: Implement captcha for login failed after 5 times
  // TODO: Implement lock account after 10 times failed login for secure
  public async login(
    identify: string,
    password: string
  ): Promise<{ access_token: string; refresh_token: string }> {
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

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_REFRESH_EXP,
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
  }

  /**
   * @description: Api to change password
   * @param userEmail
   * @param currentPassword
   * @param newPassword
   */
  // TODO: Need to implement password policy for strong and safe password
  public async changePassword(
    userEmail: string,
    currentPassword: string,
    newPassword: string
  ): Promise<Boolean> {
    const user = await this.userRepository.getUserByUserNameOrEmail([
      userEmail,
    ]);
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordMatch) {
      throw new HttpException(
        {
          message: AuthMessageFailed.InvalidCurrentPassword,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_OR_ROUNDS));
    user.password = await bcrypt.hash(newPassword, salt);
    await this.userRepository.save(user);
    return true;
  }

  /**
   * @description Get new account token from refresh token
   * @param refreshToken
   */
  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const refreshTokenDecode = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        }
      );
      return {
        access_token: await this.jwtService.signAsync({
          id: refreshTokenDecode.id,
          email: refreshTokenDecode.email,
          role: refreshTokenDecode.role,
        }),
      };
    } catch (error) {
      throw new HttpException(
        { message: AuthMessageFailed.InvalidRefreshToken },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
