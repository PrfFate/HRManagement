import type { Role, User } from "@prisma/client";

type UserWithRole = User & {
  role: Role;
};

export function mapUser(user: UserWithRole) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    roleId: user.roleId,
    roleName: user.role.name,
    isActive: user.isActive,
    approvalStatus: user.approvalStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
