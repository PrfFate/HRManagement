import type { Prisma } from "@prisma/client";

import { prisma } from "../../shared/prisma.js";

export const leaveRequestRepository = {
  create(data: Prisma.LeaveRequestUncheckedCreateInput) {
    return prisma.leaveRequest.create({
      data,
      include: { user: true },
    });
  },

  findById(id: string) {
    return prisma.leaveRequest.findUnique({
      where: { id },
      include: { user: true },
    });
  },

  count(where: Prisma.LeaveRequestWhereInput) {
    return prisma.leaveRequest.count({ where });
  },

  findMany(args: {
    where: Prisma.LeaveRequestWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.leaveRequest.findMany({
      where: args.where,
      skip: args.skip,
      take: args.take,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  },

  updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    return prisma.leaveRequest.update({
      where: { id },
      data: { status },
      include: { user: true },
    });
  },

  updatePendingStatus(id: string, status: "APPROVED" | "REJECTED") {
    return prisma.leaveRequest.updateMany({
      where: { id, status: "PENDING" },
      data: { status },
    });
  },
};
