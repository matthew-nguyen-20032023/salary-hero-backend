import { UserEntity, UserRole } from "src/models/entities/user.entity";
import { generateRandomEmail, generateRandomUsername } from "src/shares/common";

export function mockRandomUser(
  userRole: UserRole,
  createdBy = null
): UserEntity {
  const newUser = new UserEntity();
  newUser.email = generateRandomEmail();
  newUser.password = "test";
  newUser.role = userRole;
  newUser.username = generateRandomUsername();
  if (createdBy) newUser.created_by = createdBy;
  return newUser;
}
