export const RoleIds = {
  Manager: 1,
  Employee: 2,
  PendingUser: 3,
} as const;

export const RoleNames = {
  Manager: "Manager",
  Employee: "Employee",
  PendingUser: "PendingUser",
} as const;

export type RoleId = (typeof RoleIds)[keyof typeof RoleIds];
