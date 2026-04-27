import type { RoleName } from "../types";
import { roleLabels } from "../constants";

type RoleBadgeProps = {
  roleName: RoleName;
};

export function RoleBadge({ roleName }: RoleBadgeProps) {
  return <span className="role-badge">{roleLabels[roleName]}</span>;
}
