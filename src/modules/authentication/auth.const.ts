import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/models/entities/user.entity";

export enum AuthMessageFailed {
  UsernameOrPasswordIncorrect = "Username or password is incorrect!",
  UserHasRegister = "Username or email was taken!",
}

export enum AuthMessageSuccess {
  LoginSuccessMessage = "Login successfully",
  RegisterAccountSuccess = "Register account successfully",
}

export const Public = () => SetMetadata(process.env.PUBLIC_KEY_JWT, true);
export const Roles = (...roles: UserRole[]) =>
  SetMetadata(process.env.ROLE_KEY_JWT, roles);
