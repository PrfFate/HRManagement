import { leaveStatusLabels } from "../constants";
import type { LeaveStatus } from "../types";

type StatusBadgeProps = {
  status: LeaveStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge ${status.toLowerCase()}`}>{leaveStatusLabels[status]}</span>;
}
