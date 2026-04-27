import type { LeaveStatus, LeaveType, RoleId, RoleName } from "./types";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export const roleOptions: Array<{ id: RoleId; label: string }> = [
  { id: 1, label: "Yönetici" },
  { id: 2, label: "Personel" },
  { id: 3, label: "Bekleyen Kullanıcı" },
];

export const roleLabels: Record<RoleName, string> = {
  Manager: "Yönetici",
  Employee: "Personel",
  PendingUser: "Bekleyen Kullanıcı",
};

export const leaveTypeLabels: Record<LeaveType, string> = {
  ANNUAL: "Yıllık İzin",
  SICK: "Sağlık İzni",
  PERSONAL: "Mazeret İzni",
};

export const leaveStatusLabels: Record<LeaveStatus, string> = {
  PENDING: "Beklemede",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
};

export const leaveStatusOptions: Array<{ value: LeaveStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "Tümü" },
  { value: "PENDING", label: "Beklemede" },
  { value: "APPROVED", label: "Onaylandı" },
  { value: "REJECTED", label: "Reddedildi" },
];
