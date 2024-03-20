import { EntityRepository, In, Repository } from "typeorm";
import { UserEntity } from "src/models/entities/user.entity";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  /**
   * @description function get user by username or email
   * @param identify
   */
  public async getUserByUserNameOrEmail(
    identify: string[]
  ): Promise<UserEntity> {
    return this.findOne({
      where: [{ username: In(identify) }, { email: In(identify) }],
    });
  }

  /**
   * @description get list user by created_by
   * @param createdUserId
   * @param page
   * @param limit
   */
  public async getListUserByCreatedUserId(
    createdUserId: number,
    page: number,
    limit: number
  ): Promise<UserEntity[]> {
    return await this.find({
      where: {
        created_by: createdUserId,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  /**
   * @description count user by created_by
   * @param createdUserId
   */
  public async countUserByCreatedUserId(
    createdUserId: number
  ): Promise<number> {
    return await this.count({
      where: { created_by: createdUserId },
    });
  }
}
