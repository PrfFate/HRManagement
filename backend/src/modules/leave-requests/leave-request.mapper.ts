import type { LeaveRequest, Role, User } from "@prisma/client";

type LeaveRequestWithUser = LeaveRequest & {
  user: User & {
    role?: Role;
  };
};

export function mapLeaveRequest(leaveRequest: LeaveRequestWithUser) {
  return {
    id: leaveRequest.id,
    userId: leaveRequest.userId,
    employee: {
      id: leaveRequest.user.id,
      fullName: leaveRequest.user.fullName,
      email: leaveRequest.user.email,
      phone: leaveRequest.user.phone,
    },
    leaveType: leaveRequest.leaveType,
    startDate: leaveRequest.startDate,
    endDate: leaveRequest.endDate,
    description: leaveRequest.description,
    status: leaveRequest.status,
    createdAt: leaveRequest.createdAt,
    updatedAt: leaveRequest.updatedAt,
  };
}
