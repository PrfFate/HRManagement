import { apiRequest } from "../lib/api";
import type { ApiResponse, User } from "../types";

type LoginResponse = {
  token: string;
  user: User;
};

export function login(payload: { email: string; password: string }) {
  return apiRequest<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}) {
  return apiRequest<ApiResponse<User>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe(token: string) {
  return apiRequest<ApiResponse<User>>("/auth/me", { token });
}
