import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "src/models/entities/user.entity";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  /**
   * @description function get user by username or email
   * @param identify
   */
  public async getUserByUserNameOrEmail(identify: string): Promise<UserEntity> {
    return this.findOne({
      where: [{ username: identify }, { email: identify }],
    });
  }
}
