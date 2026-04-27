import type { Prisma } from "@prisma/client";

import { RoleIds, type RoleId } from "../../common/constants/roles.js";
import { AppError } from "../../common/errors/AppError.js";
import { createPaginationMeta, getPagination } from "../../common/utils/pagination.js";
import { mapUser } from "./user.mapper.js";
import { userRepository } from "./user.repository.js";
import type {
  ListPendingUsersQuery,
  ListUsersQuery,
  UpdateUserRoleInput,
} from "./user.validation.js";

const allowedRoleIds = [RoleIds.Manager, RoleIds.Employee, RoleIds.PendingUser];

export const userService = {
  async list(query: ListUsersQuery) {
    const pagination = getPagination(query);
    const where: Prisma.UserWhereInput = {};

    if (query.search) {
      where.fullName = { contains: query.search, mode: "insensitive" };
    }

    if (query.roleId !== undefined) {
      if (!allowedRoleIds.includes(query.roleId as RoleId)) {
        throw new AppError("Rol filtresi geçersiz.", 400);
      }

      where.roleId = query.roleId;
    }

    const [totalItems, users] = await Promise.all([
      userRepository.count(where),
      userRepository.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
      }),
    ]);

    return {
      items: users.map(mapUser),
      pagination: createPaginationMeta(pagination.page, pagination.pageSize, totalItems),
    };
  },

  async listPending(query: ListPendingUsersQuery) {
    const pagination = getPagination(query);
    const where: Prisma.UserWhereInput = {
      roleId: RoleIds.PendingUser,
      isActive: false,
      approvalStatus: "PENDING",
    };

    if (query.search) {
      where.fullName = { contains: query.search, mode: "insensitive" };
    }

    const [totalItems, users] = await Promise.all([
      userRepository.count(where),
      userRepository.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
      }),
    ]);

    return {
      items: users.map(mapUser),
      pagination: createPaginationMeta(pagination.page, pagination.pageSize, totalItems),
    };
  },

  async approve(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("Kullanıcı bulunamadı.", 404);
    }

    if (
      user.roleId !== RoleIds.PendingUser ||
      user.isActive ||
      user.approvalStatus !== "PENDING"
    ) {
      throw new AppError("Yalnızca bekleyen kullanıcılar onaylanabilir.", 400);
    }

    const updateResult = await userRepository.updatePendingApprovalState(
      id,
      RoleIds.Employee,
      true,
      "APPROVED",
    );
    const updatedUser = await userRepository.findById(id);

    if (updateResult.count === 0 || !updatedUser) {
      throw new AppError("Yalnızca bekleyen kullanıcılar onaylanabilir.", 400);
    }

    return mapUser(updatedUser);
  },

  async reject(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("Kullanıcı bulunamadı.", 404);
    }

    if (user.roleId !== RoleIds.PendingUser || user.approvalStatus !== "PENDING") {
      throw new AppError("Yalnızca bekleyen kullanıcılar reddedilebilir.", 400);
    }

    const updateResult = await userRepository.updatePendingApprovalState(
      id,
      RoleIds.PendingUser,
      false,
      "REJECTED",
    );
    const updatedUser = await userRepository.findById(id);

    if (updateResult.count === 0 || !updatedUser) {
      throw new AppError("Yalnızca bekleyen kullanıcılar reddedilebilir.", 400);
    }

    return mapUser(updatedUser);
  },

  async updateRole(id: string, input: UpdateUserRoleInput, currentUserId: string) {
    if (id === currentUserId) {
      throw new AppError("Kendi rolünüzü değiştiremezsiniz.", 400);
    }

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("Kullanıcı bulunamadı.", 404);
    }

    const isPendingRole = input.roleId === RoleIds.PendingUser;
    const updatedUser = await userRepository.updateRole(
      id,
      input.roleId,
      !isPendingRole,
      isPendingRole ? "PENDING" : "APPROVED",
    );

    return mapUser(updatedUser);
  },
};
