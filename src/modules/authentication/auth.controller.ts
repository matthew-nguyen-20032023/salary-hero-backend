import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpStatus, Post, Put } from "@nestjs/common";
import {
  AuthMessageSuccess,
  Public,
  Roles,
} from "src/modules/authentication/auth.const";
import { UserId } from "src/decorators/user-id.decorator";
import { UserRole } from "src/models/entities/user.entity";
import { UserEmail } from "src/decorators/user-email.decorator";
import { LoginDto } from "src/modules/authentication/dto/login.dto";
import { AuthService } from "src/modules/authentication/auth.service";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { RegisterDto } from "src/modules/authentication/dto/register.dto";
import { ChangePasswordDto } from "src/modules/authentication/dto/change-password.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @Post("register-for-partner")
  @ApiOperation({
    summary: "[Admin] Api to Salary Hero use to register partner account",
  })
  @Roles(UserRole.Admin)
  async registerForPartner(
    @UserId() userId: number,
    @Body() registerDto: RegisterDto
  ): Promise<IResponseToClient> {
    const data = await this.authService.register(
      registerDto.userName,
      registerDto.email,
      registerDto.password,
      UserRole.Partner,
      userId
    );
    return {
      message: AuthMessageSuccess.RegisterAccountSuccess,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiBearerAuth()
  @Post("register-for-worker")
  @ApiOperation({
    summary: "[Partner] Api to partner use to register their worker account",
  })
  @Roles(UserRole.Partner)
  async registerForWorker(
    @UserId() userId: number,
    @Body() registerDto: RegisterDto
  ): Promise<IResponseToClient> {
    const data = await this.authService.register(
      registerDto.userName,
      registerDto.email,
      registerDto.password,
      UserRole.Worker,
      userId
    );
    return {
      message: AuthMessageSuccess.RegisterAccountSuccess,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post("login")
  @ApiOperation({
    summary: "[Public] Api for all type of user to login",
  })
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<IResponseToClient> {
    const data = await this.authService.login(
      loginDto.identify,
      loginDto.password
    );
    return {
      message: AuthMessageSuccess.LoginSuccessMessage,
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @ApiBearerAuth()
  @Put("change-password")
  @ApiOperation({
    summary: "[ALL] Api for all type of user login to change their password",
  })
  async changePassword(
    @UserEmail() userEmail: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<IResponseToClient> {
    const data = await this.authService.changePassword(
      userEmail,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword
    );
    return {
      message: AuthMessageSuccess.ChangePasswordSuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Post("refresh-token")
  @ApiOperation({
    summary:
      "[ALL] Api to get new token from refresh token, so that user dont need to login again when their token expire",
  })
  @Public()
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<IResponseToClient> {
    const data = await this.authService.refreshToken(
      refreshTokenDto.refreshToken
    );
    return {
      message: AuthMessageSuccess.RefreshTokenSuccessfully,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }
}
