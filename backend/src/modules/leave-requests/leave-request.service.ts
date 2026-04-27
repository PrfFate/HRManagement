import type { Prisma } from "@prisma/client";

import { LeaveStatuses } from "../../common/constants/leave.js";
import { AppError } from "../../common/errors/AppError.js";
import { createPaginationMeta, getPagination } from "../../common/utils/pagination.js";
import { mapLeaveRequest } from "./leave-request.mapper.js";
import { leaveRequestRepository } from "./leave-request.repository.js";
import type {
  CreateLeaveRequestInput,
  ListLeaveRequestsQuery,
  UpdateLeaveRequestStatusInput,
} from "./leave-request.validation.js";

export const leaveRequestService = {
  async create(userId: string, input: CreateLeaveRequestInput) {
    const leaveRequest = await leaveRequestRepository.create({
      userId,
      leaveType: input.leaveType,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
      status: LeaveStatuses.Pending,
    });

    return mapLeaveRequest(leaveRequest);
  },

  async listAll(query: ListLeaveRequestsQuery) {
    const pagination = getPagination(query);
    const where: Prisma.LeaveRequestWhereInput = {};

    if (query.search) {
      where.user = {
        fullName: { contains: query.search, mode: "insensitive" },
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const [totalItems, leaveRequests] = await Promise.all([
      leaveRequestRepository.count(where),
      leaveRequestRepository.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
      }),
    ]);

    return {
      items: leaveRequests.map(mapLeaveRequest),
      pagination: createPaginationMeta(pagination.page, pagination.pageSize, totalItems),
    };
  },

  async listMine(userId: string, query: ListLeaveRequestsQuery) {
    const pagination = getPagination(query);
    const where: Prisma.LeaveRequestWhereInput = {
      userId,
    };

    if (query.status) {
      where.status = query.status;
    }

    const [totalItems, leaveRequests] = await Promise.all([
      leaveRequestRepository.count(where),
      leaveRequestRepository.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
      }),
    ]);

    return {
      items: leaveRequests.map(mapLeaveRequest),
      pagination: createPaginationMeta(pagination.page, pagination.pageSize, totalItems),
    };
  },

  async updateStatus(id: string, input: UpdateLeaveRequestStatusInput) {
    const leaveRequest = await leaveRequestRepository.findById(id);

    if (!leaveRequest) {
      throw new AppError("İzin talebi bulunamadı.", 404);
    }

    if (leaveRequest.status !== LeaveStatuses.Pending) {
      throw new AppError("Sonuçlanmış izin talebi tekrar güncellenemez.", 400);
    }

    const updateResult = await leaveRequestRepository.updatePendingStatus(id, input.status);

    if (updateResult.count === 0) {
      throw new AppError("Sonuçlanmış izin talebi tekrar güncellenemez.", 400);
    }

    const updatedLeaveRequest = await leaveRequestRepository.findById(id);

    return mapLeaveRequest(updatedLeaveRequest!);
  },
};
