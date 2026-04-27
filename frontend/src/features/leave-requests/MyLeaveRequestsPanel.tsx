import { useEffect, useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { StatusBadge } from "../../components/StatusBadge";
import { leaveTypeLabels } from "../../constants";
import { formatDateRange } from "../../lib/format";
import { getErrorMessage } from "../../lib/forms";
import { listLeaveRequests } from "../../services/leaveService";
import type { LeaveRequest } from "../../types";

export function MyLeaveRequestsPanel({ token }: { token: string }) {
  const [items, setItems] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setIsLoading(true);
    try {
      const response = await listLeaveRequests({ token, page: 1, pageSize: 50, mine: true });
      setItems(response.data.items);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="panel-section" id="my-leaves">
      <h2>İzinlerim</h2>
      {message && <p className="form-message">{message}</p>}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>İzin Türü</th>
              <th>Tarih Aralığı</th>
              <th>Açıklama</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td data-label="İzin Türü">{leaveTypeLabels[item.leaveType]}</td>
                <td data-label="Tarih Aralığı">{formatDateRange(item.startDate, item.endDate)}</td>
                <td data-label="Açıklama">{item.description || "-"}</td>
                <td data-label="Durum"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && items.length === 0 && <EmptyState title="Henüz izin talebiniz bulunmuyor." />}
      </div>
    </section>
  );
}
