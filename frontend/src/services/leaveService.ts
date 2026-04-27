import { apiRequest } from "../lib/api";
import type {
  ApiResponse,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
  PaginatedResponse,
} from "../types";

type ListLeaveParams = {
  token: string;
  search?: string;
  status?: LeaveStatus | "ALL";
  page: number;
  pageSize: number;
  mine?: boolean;
};

export function listLeaveRequests({
  token,
  search,
  status,
  page,
  pageSize,
  mine = false,
}: ListLeaveParams) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (search && !mine) {
    params.set("search", search);
  }

  if (status && status !== "ALL") {
    params.set("status", status);
  }

  return apiRequest<PaginatedResponse<LeaveRequest>>(
    `/leave-requests${mine ? "/my" : ""}?${params.toString()}`,
    { token },
  );
}

export function createLeaveRequest(
  token: string,
  payload: {
    leaveType: LeaveType | "";
    startDate: string;
    endDate: string;
    description?: string;
  },
) {
  return apiRequest<ApiResponse<LeaveRequest>>("/leave-requests", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateLeaveRequestStatus(token: string, id: string, status: Exclude<LeaveStatus, "PENDING">) {
  return apiRequest<ApiResponse<LeaveRequest>>(`/leave-requests/${id}/status`, {
    method: "PUT",
    token,
    body: JSON.stringify({ status }),
  });
}
