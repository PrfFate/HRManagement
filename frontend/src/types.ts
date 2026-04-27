export type RoleId = 1 | 2 | 3;
export type RoleName = "Manager" | "Employee" | "PendingUser";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type LeaveType = "ANNUAL" | "SICK" | "PERSONAL";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AppView = "leaves" | "users" | "my-leaves";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  roleId: RoleId;
  roleName: RoleName;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
};

export type LeaveRequest = {
  id: string;
  userId: string;
  employee: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  description: string | null;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: Pagination;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string>;
};
