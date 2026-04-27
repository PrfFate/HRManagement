import type { Prisma } from "@prisma/client";

import { RoleIds } from "../../common/constants/roles.js";
import { prisma } from "../../shared/prisma.js";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  },

  create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  },

  count(where: Prisma.UserWhereInput) {
    return prisma.user.count({ where });
  },

  findMany(args: {
    where: Prisma.UserWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.user.findMany({
      where: args.where,
      skip: args.skip,
      take: args.take,
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });
  },

  updateApprovalState(
    id: string,
    roleId: number,
    isActive: boolean,
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED",
  ) {
    return prisma.user.update({
      where: { id },
      data: { roleId, isActive, approvalStatus },
      include: { role: true },
    });
  },

  updatePendingApprovalState(
    id: string,
    roleId: number,
    isActive: boolean,
    approvalStatus: "APPROVED" | "REJECTED",
  ) {
    return prisma.user.updateMany({
      where: {
        id,
        roleId: RoleIds.PendingUser,
        isActive: false,
        approvalStatus: "PENDING",
      },
      data: { roleId, isActive, approvalStatus },
    });
  },

  updateRole(id: string, roleId: number, isActive: boolean, approvalStatus: "PENDING" | "APPROVED") {
    return prisma.user.update({
      where: { id },
      data: { roleId, isActive, approvalStatus },
      include: { role: true },
    });
  },
};
