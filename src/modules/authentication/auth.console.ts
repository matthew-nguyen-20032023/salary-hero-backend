import * as bcrypt from "bcrypt";
import { Injectable, Logger } from "@nestjs/common";
import { Command, Console } from "nestjs-console";
import { UserEntity, UserRole } from "src/models/entities/user.entity";
import { UserRepository } from "src/models/repositories/user.repository";

@Console()
@Injectable()
export class AuthConsole {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {
    this.logger.setContext(AuthConsole.name);
  }

  @Command({
    command: "register-admin <username> <email> <password>",
    description: "Create admin account",
  })
  async registerAdminAccount(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_OR_ROUNDS));
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = await bcrypt.hash(password, salt);
    newUser.role = UserRole.Admin;
    const userCreated = await this.userRepository.save(newUser);
    this.logger.log("info", `User created successfully! ${userCreated}`);
  }
}
