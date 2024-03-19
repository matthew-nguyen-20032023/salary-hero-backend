import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { UserEntity } from "src/models/entities/user.entity";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private entityManager: EntityManager) {
    super(UserEntity, entityManager);
  }

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
