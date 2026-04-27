import { apiRequest } from "../lib/api";
import type { ApiResponse, PaginatedResponse, RoleId, User } from "../types";

type ListUsersParams = {
  token: string;
  search?: string;
  roleId?: RoleId | "ALL";
  page: number;
  pageSize: number;
};

export function listUsers({ token, search, roleId, page, pageSize }: ListUsersParams) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (search) {
    params.set("search", search);
  }

  if (roleId && roleId !== "ALL") {
    params.set("roleId", String(roleId));
  }

  return apiRequest<PaginatedResponse<User>>(`/users?${params.toString()}`, { token });
}

export function approveUser(token: string, id: string) {
  return apiRequest<ApiResponse<User>>(`/users/${id}/approve`, {
    method: "PUT",
    token,
  });
}

export function rejectUser(token: string, id: string) {
  return apiRequest<ApiResponse<User>>(`/users/${id}/reject`, {
    method: "PUT",
    token,
  });
}

export function updateUserRole(token: string, id: string, roleId: RoleId) {
  return apiRequest<ApiResponse<User>>(`/users/${id}/role`, {
    method: "PUT",
    token,
    body: JSON.stringify({ roleId }),
  });
}
