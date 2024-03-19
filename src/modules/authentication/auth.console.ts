const bcrypt = require("bcrypt");
import { Command, Console } from "nestjs-console";
import { UserEntity, UserRole } from "src/models/entities/user.entity";
import { UserRepository } from "src/models/repositories/user.repository";

@Console()
export class AuthConsole {
  constructor(private readonly userRepository: UserRepository) {}

  @Command({ command: "register-admin <username> <email> <password>" })
  async autoCompleteStake(
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
    console.log("User created successfully!", userCreated);
  }
}
